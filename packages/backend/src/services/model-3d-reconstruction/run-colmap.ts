import fs from 'node:fs/promises';
import path from 'node:path';

import { reconstructionConfig } from './config.ts';
import { runBinary } from './exec.ts';

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs COLMAP's structure-from-motion pipeline (feature extraction ->
 * sequential matching -> incremental mapping -> undistortion) against the
 * extracted frames. Returns the undistorted "dense" workspace directory that
 * OpenMVS's InterfaceCOLMAP consumes next.
 */
export async function runColmapSfm(
  framesDir: string,
  workDir: string
): Promise<string> {
  const { colmapBin, stageTimeoutMs } = reconstructionConfig;
  const databasePath = path.join(workDir, 'database.db');
  const sparseDir = path.join(workDir, 'sparse');
  const denseDir = path.join(workDir, 'dense');

  await fs.mkdir(sparseDir, { recursive: true });

  await runBinary(
    colmapBin,
    [
      'feature_extractor',
      '--database_path',
      databasePath,
      '--image_path',
      framesDir,
      '--ImageReader.single_camera',
      '1',
      '--ImageReader.camera_model',
      'SIMPLE_RADIAL',
      // SIFT defaults to GPU (OpenGL) extraction, which needs a display —
      // worker hosts are headless with no GPU/X server available.
      '--SiftExtraction.use_gpu',
      '0',
    ],
    { stageName: 'colmap feature_extractor', timeoutMs: stageTimeoutMs }
  );

  await runBinary(
    colmapBin,
    [
      'sequential_matcher',
      '--database_path',
      databasePath,
      '--SiftMatching.use_gpu',
      '0',
    ],
    { stageName: 'colmap sequential_matcher', timeoutMs: stageTimeoutMs }
  );

  await runBinary(
    colmapBin,
    [
      'mapper',
      '--database_path',
      databasePath,
      '--image_path',
      framesDir,
      '--output_path',
      sparseDir,
    ],
    { stageName: 'colmap mapper', timeoutMs: stageTimeoutMs }
  );

  const sparseModelDir = path.join(sparseDir, '0');
  if (!(await pathExists(sparseModelDir))) {
    throw new Error(
      'colmap mapper: no sparse model was produced — frames had too ' +
        'little overlap or texture to register camera poses'
    );
  }

  await runBinary(
    colmapBin,
    [
      'image_undistorter',
      '--image_path',
      framesDir,
      '--input_path',
      sparseModelDir,
      '--output_path',
      denseDir,
      '--output_type',
      'COLMAP',
    ],
    { stageName: 'colmap image_undistorter', timeoutMs: stageTimeoutMs }
  );

  return denseDir;
}
