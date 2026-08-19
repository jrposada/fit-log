import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { v4 as uuid } from 'uuid';

import Logger from '../../../infrastructure/logger.ts';
import { convertObjToGlb } from './reconstruction/convert-to-glb.ts';
import { extractFrames } from './reconstruction/extract-frames.ts';
import { runColmapSfm } from './reconstruction/run-colmap.ts';
import { runOpenMvsPipeline } from './reconstruction/run-openmvs.ts';

export type ReconstructionResult = {
  /** Absolute path to the produced glTF/GLB (or similar) on disk. */
  modelPath: string;
  mimeType: string;
  /** Removes the temp work dir backing `modelPath` — call once its contents have been read. */
  cleanup: () => Promise<void>;
};

export interface ReconstructionProcessor {
  /** Runs the SfM -> MVS -> mesh -> texture pipeline against a source video. */
  reconstruct(videoPath: string): Promise<ReconstructionResult>;
}

async function removeDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

/**
 * Shells out to COLMAP (structure-from-motion) and OpenMVS (dense point
 * cloud -> mesh -> texture), then bundles the textured OBJ into a single
 * GLB. Requires `colmap`, `ffmpeg`/`ffprobe`, and the OpenMVS CLI tools to be
 * installed on the host running the worker (see COLMAP_BIN, FFMPEG_BIN,
 * FFPROBE_BIN, OPENMVS_BIN_DIR env vars).
 */
class ColmapOpenMvsReconstructionProcessor implements ReconstructionProcessor {
  async reconstruct(videoPath: string): Promise<ReconstructionResult> {
    const workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'model-3d-reconstruction-')
    );
    const startedAt = Date.now();
    Logger.debug(
      `[reconstruction] starting pipeline for "${videoPath}" in workDir "${workDir}"`
    );

    try {
      const framesDir = path.join(workDir, 'frames');
      Logger.debug('[reconstruction] stage 1/4: extracting frames');
      await extractFrames(videoPath, framesDir);

      Logger.debug('[reconstruction] stage 2/4: running colmap SfM');
      const denseDir = await runColmapSfm(framesDir, workDir);

      Logger.debug('[reconstruction] stage 3/4: running openmvs pipeline');
      const texturedObjPath = await runOpenMvsPipeline(denseDir);

      const glbPath = path.join(workDir, `${uuid()}.glb`);
      Logger.debug(
        '[reconstruction] stage 4/4: converting textured obj to glb'
      );
      await convertObjToGlb(texturedObjPath, glbPath);

      Logger.debug(
        `[reconstruction] pipeline finished in ${Date.now() - startedAt}ms — output "${glbPath}"`
      );

      return {
        modelPath: glbPath,
        mimeType: 'model/gltf-binary',
        cleanup: () => removeDir(workDir),
      };
    } catch (error) {
      Logger.debug(
        `[reconstruction] pipeline failed after ${Date.now() - startedAt}ms in workDir "${workDir}":`,
        error
      );
      await removeDir(workDir);
      throw error;
    }
  }
}

export const reconstructionProcessor: ReconstructionProcessor =
  new ColmapOpenMvsReconstructionProcessor();
