import fs from 'node:fs/promises';
import path from 'node:path';

import { openMvsBinPath, reconstructionConfig } from './config.ts';
import { runBinary } from './exec.ts';

async function requireFile(filePath: string, stageName: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(
      `${stageName}: expected output "${filePath}" was not produced`
    );
  }
}

/**
 * Runs the OpenMVS dense reconstruction pipeline against a COLMAP dense
 * workspace (as produced by `colmap image_undistorter --output_type COLMAP`):
 * interface -> densify -> mesh -> refine -> texture. Returns the path to the
 * final textured OBJ (with its sibling .mtl and texture image).
 */
export async function runOpenMvsPipeline(denseDir: string): Promise<string> {
  const { stageTimeoutMs } = reconstructionConfig;

  const scenePath = path.join(denseDir, 'scene.mvs');
  const densePath = path.join(denseDir, 'scene_dense.mvs');
  const meshPath = path.join(denseDir, 'scene_mesh.mvs');
  const refinedPath = path.join(denseDir, 'scene_mesh_refined.mvs');
  const texturedBase = 'scene_textured';
  const texturedObjPath = path.join(denseDir, `${texturedBase}.obj`);

  await runBinary(
    openMvsBinPath('InterfaceCOLMAP'),
    ['-i', '.', '-o', 'scene.mvs'],
    {
      cwd: denseDir,
      stageName: 'openmvs InterfaceCOLMAP',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(scenePath, 'openmvs InterfaceCOLMAP');

  await runBinary(
    openMvsBinPath('DensifyPointCloud'),
    ['scene.mvs', '-o', 'scene_dense.mvs'],
    {
      cwd: denseDir,
      stageName: 'openmvs DensifyPointCloud',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(densePath, 'openmvs DensifyPointCloud');

  await runBinary(
    openMvsBinPath('ReconstructMesh'),
    ['scene_dense.mvs', '-o', 'scene_mesh.mvs'],
    {
      cwd: denseDir,
      stageName: 'openmvs ReconstructMesh',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(meshPath, 'openmvs ReconstructMesh');

  await runBinary(
    openMvsBinPath('RefineMesh'),
    ['scene_mesh.mvs', '-o', 'scene_mesh_refined.mvs'],
    {
      cwd: denseDir,
      stageName: 'openmvs RefineMesh',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(refinedPath, 'openmvs RefineMesh');

  await runBinary(
    openMvsBinPath('TextureMesh'),
    [
      'scene_mesh_refined.mvs',
      '-o',
      `${texturedBase}.mvs`,
      '--export-type',
      'obj',
    ],
    {
      cwd: denseDir,
      stageName: 'openmvs TextureMesh',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(texturedObjPath, 'openmvs TextureMesh');

  return texturedObjPath;
}
