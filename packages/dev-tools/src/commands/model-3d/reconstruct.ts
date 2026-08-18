import fs from 'node:fs/promises';
import path from 'node:path';

import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { upsertOwnedDocument } from '@backend/data/infrastructure/upsert-owned-document';
import { Model3d } from '@backend/data/models/model-3d';
import { User } from '@backend/data/models/user';
import { enqueueModel3dReconstruction } from '@backend/jobs/queues/model-3d-reconstruction-queue';
import { VideoProcessor } from '@backend/services/video-processor';
import type { Command } from 'commander';

import {
  connectToDatabase,
  disconnectFromDatabase,
} from '../../utils/database';
import { findKeycloakUserByEmail } from '../../utils/keycloak-admin';

const EXTENSION_MIME_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
};

const POLL_INTERVAL_MS = 2000;
/** Reconstruction can legitimately take a long time; this is a CLI-side backstop, not a pipeline timeout. */
const POLL_TIMEOUT_MS = 60 * 60 * 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The video gets written under this CLI's own DATA_DIR (this process's
 * filesystem view), but the worker that reads it back might be a
 * different process with a *different* filesystem view of the same
 * bind-mounted directory — e.g. this CLI on the host vs. the worker
 * inside the docker-compose `backend` container. In normal operation the
 * API route and worker are the same process, so this never comes up; a
 * standalone enqueuer has to translate the path explicitly instead.
 */
function toWorkerVideoPath(hostVideoPath: string): string {
  const workerDataDir = process.env.MODEL_3D_WORKER_DATA_DIR;
  if (!workerDataDir) {
    return hostVideoPath;
  }

  const hostDataDir = process.env.DATA_DIR;
  assert(hostDataDir, { msg: 'DATA_DIR environment variable is not set' });

  if (!hostVideoPath.startsWith(hostDataDir)) {
    throw new Error(
      `videoPath "${hostVideoPath}" is not under DATA_DIR "${hostDataDir}" — can't rewrite it for MODEL_3D_WORKER_DATA_DIR`
    );
  }

  return workerDataDir + hostVideoPath.slice(hostDataDir.length);
}

interface CliOptions {
  email: string;
  watch: boolean;
}

export function registerReconstructCommand(model3dCmd: Command): void {
  model3dCmd
    .command('reconstruct <videoPath>')
    .description(
      'Queue a video-to-3D reconstruction job from a local video file, ' +
        'the same way POST /model-3ds/from-video does — bypasses app-mobile ' +
        'and Keycloak entirely, useful for exercising the colmap/OpenMVS ' +
        'pipeline directly. If the worker runs in the docker-compose ' +
        '`backend` service rather than natively, set ' +
        'MODEL_3D_WORKER_DATA_DIR (see .example.env) so the queued job ' +
        'points at a path the container can actually read.'
    )
    .option(
      '--email <email>',
      'Owner email — looked up in Mongo, or bootstrapped from Keycloak if missing (same as `setup data`)',
      'dev@example.com'
    )
    .option(
      '--no-watch',
      'Queue the job and exit immediately instead of polling for the result'
    )
    .action(async (videoPath: string, options: CliOptions) => {
      const resolvedPath = path.resolve(videoPath);
      const extension = path.extname(resolvedPath).toLowerCase();
      const mimeType = EXTENSION_MIME_TYPES[extension];
      if (!mimeType) {
        console.error(
          `Unsupported video extension "${extension}" — expected one of: ${Object.keys(EXTENSION_MIME_TYPES).join(', ')}`
        );
        process.exit(1);
      }

      // enqueueModel3dReconstruction opens its own BullMQ/ioredis
      // connection that nothing here ever closes, so an early `return`
      // inside the try (skipping the process.exit below) would leave the
      // process hanging on that open handle instead of exiting. Track the
      // outcome instead and exit exactly once, after cleanup, regardless
      // of which branch below ran.
      let exitCode = 0;
      try {
        await connectToDatabase();

        const buffer = await fs.readFile(resolvedPath);
        console.log(
          `Read ${resolvedPath} (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB)`
        );

        let owner = await User.findOne({ email: options.email });
        if (!owner) {
          const kcUser = await findKeycloakUserByEmail(options.email);
          if (!kcUser) {
            throw new Error(
              `No Keycloak user found with email "${options.email}". ` +
                'Either create one in the realm or pass --email.'
            );
          }
          const fullName = [kcUser.firstName, kcUser.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          owner = await User.create({
            keycloakId: kcUser.id,
            email: kcUser.email,
            name: fullName || kcUser.email,
            roles: [],
          });
          console.log(`Created Mongo user for ${owner.email}`);
        }

        // Mirrors services/model-3d.ts's createModel3dFromVideo, except
        // the enqueued videoPath goes through toWorkerVideoPath — see its
        // comment for why that can't be done from inside the shared
        // service function.
        const videoProcessor = new VideoProcessor();
        const { videoPath: hostVideoPath } =
          await videoProcessor.processVideoFromBase64(
            buffer.toString('base64'),
            mimeType
          );

        const model3d = await upsertOwnedDocument(Model3d, undefined, owner, {
          status: 'processing',
        });
        if (!model3d) {
          throw new Error('Model3d creation failed');
        }
        const id = model3d._id.toString();

        await enqueueModel3dReconstruction({
          model3dId: id,
          videoPath: toWorkerVideoPath(hostVideoPath),
        });
        console.log(`Queued Model3d ${id} (status: ${model3d.status})`);

        if (options.watch) {
          console.log('Watching for completion (Ctrl+C to stop watching)...');
          const deadline = Date.now() + POLL_TIMEOUT_MS;
          let settled = false;
          while (!settled && Date.now() < deadline) {
            await sleep(POLL_INTERVAL_MS);
            const current = await Model3d.findById(id);
            if (!current) {
              throw new Error(`Model3d ${id} disappeared while watching`);
            }
            if (current.status === 'ready') {
              console.log(`✓ Ready — modelUrl: ${current.modelUrl}`);
              settled = true;
            } else if (current.status === 'failed') {
              console.error(`✗ Failed — ${current.error}`);
              exitCode = 1;
              settled = true;
            } else {
              process.stdout.write('.');
            }
          }
          if (!settled) {
            console.warn(
              `\nGave up watching after ${POLL_TIMEOUT_MS / 1000}s — job ${id} is still processing.`
            );
          }
        }
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(exitCode);
    });
}
