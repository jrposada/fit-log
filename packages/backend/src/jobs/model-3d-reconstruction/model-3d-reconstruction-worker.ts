import type { Job } from 'bullmq';
import { Worker } from 'bullmq';
import fs from 'fs/promises';

import type { Lifecycle } from '../../infrastructure/lifecycle.ts';
import Logger from '../../infrastructure/logger.ts';
import {
  completeModel3dReconstruction,
  failModel3dReconstruction,
} from '../../services/model-3d.ts';
import { Model3dProcessor } from '../../services/model-3d-processor.ts';
import type { ReconstructionResult } from '../../services/model-3d-reconstruction.ts';
import { reconstructionProcessor } from '../../services/model-3d-reconstruction.ts';
import { createBullMqRedisConnection } from '../infrastructure/redis.ts';
import type { Model3dReconstructionJobData } from './model-3d-reconstruction-queue.ts';
import { MODEL_3D_RECONSTRUCTION_QUEUE_NAME } from './model-3d-reconstruction-queue.ts';

async function processJob(
  job: Job<Model3dReconstructionJobData>
): Promise<void> {
  const { model3dId, videoPath } = job.data;
  let result: ReconstructionResult | undefined;

  Logger.debug(
    `[reconstruction] job ${job.id}: picked up model3d ${model3dId}, video "${videoPath}"`
  );

  try {
    result = await reconstructionProcessor.reconstruct(videoPath);

    Logger.debug(
      `[reconstruction] job ${job.id}: reading produced model from "${result.modelPath}"`
    );
    const modelBuffer = await fs.readFile(result.modelPath);
    const processed = await new Model3dProcessor().processModelFromBuffer(
      modelBuffer,
      result.mimeType
    );

    await completeModel3dReconstruction(model3dId, processed);
    Logger.debug(
      `[reconstruction] job ${job.id}: model3d ${model3dId} marked ready`
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Reconstruction failed';
    Logger.debug(
      `[reconstruction] job ${job.id}: model3d ${model3dId} failed — ${message}`
    );
    await failModel3dReconstruction(model3dId, message);
    throw error;
  } finally {
    await fs.rm(videoPath, { force: true });
    await result?.cleanup();
  }
}

export function createModel3dReconstructionWorker(): Lifecycle {
  let worker: Worker<Model3dReconstructionJobData> | undefined;

  function start(): Promise<void> {
    worker = new Worker<Model3dReconstructionJobData>(
      MODEL_3D_RECONSTRUCTION_QUEUE_NAME,
      processJob,
      { connection: createBullMqRedisConnection() }
    );

    worker.on('failed', (job, error) => {
      Logger.error(`Model3d reconstruction job ${job?.id} failed:`, error);
    });

    return Promise.resolve();
  }

  async function stop(): Promise<void> {
    await worker?.close();
    worker = undefined;
  }

  return { start, stop };
}
