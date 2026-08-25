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
 *
 * ReconstructMesh/RefineMesh/TextureMesh (OpenMVS v2.4.0) never re-serialize
 * a scene .mvs — `-o` only controls the mesh export (.ply/.obj, per
 * --export-type), and each step needs the *original* camera scene (`-i`,
 * from DensifyPointCloud) plus the *previous step's mesh* (`-m`) passed back
 * in explicitly. Chaining `-o` into the next step's positional/`-i` arg (as
 * if it were a project file, the way DensifyPointCloud's own `-o` output
 * can be) silently produces a `.ply` with the requested name yet ignored
 * extension — the next stage then fails its own file-existence check instead
 * of erroring immediately.
 */
export async function runOpenMvsPipeline(denseDir: string): Promise<string> {
  const { stageTimeoutMs } = reconstructionConfig;

  const scenePath = path.join(denseDir, 'scene.mvs');
  const densePath = path.join(denseDir, 'scene_dense.mvs');
  const meshPath = path.join(denseDir, 'scene_mesh.ply');
  const refinedPath = path.join(denseDir, 'scene_mesh_refined.ply');
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
    [
      '-i',
      'scene_dense.mvs',
      '-o',
      'scene_mesh.ply',
      // Without free-space support, ReconstructMesh's Delaunay-based surface
      // fit closes up any region between the camera trajectory and the
      // scanned object that has sparse/no point support, "ballooning" the
      // mesh out to include surface no camera ever actually saw. That
      // fabricated surface is what makes the model look nonsensical, and
      // since TextureMesh has no photo evidence for it, those faces get
      // painted with a flat dummy color instead of real texture — the
      // patchwork of solid colors seen in the output atlas.
      '--free-space-support',
      '1',
    ],
    {
      cwd: denseDir,
      stageName: 'openmvs ReconstructMesh',
      timeoutMs: stageTimeoutMs,
    }
  );
  await requireFile(meshPath, 'openmvs ReconstructMesh');

  await runBinary(
    openMvsBinPath('RefineMesh'),
    [
      '-i',
      'scene_dense.mvs',
      '-m',
      'scene_mesh.ply',
      '-o',
      'scene_mesh_refined.ply',
    ],
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
      '-i',
      'scene_dense.mvs',
      '-m',
      'scene_mesh_refined.ply',
      '-o',
      `${texturedBase}.obj`,
      '--export-type',
      'obj',
      // Both leveling passes blend/correct colors across patches using the
      // photo overlap between views. On a short, low-texture capture (few
      // frames, large uniform surfaces) that overlap is too weak for the
      // math to stay well-conditioned, and it diverges: local leveling
      // pushes whole patches to fully saturated, essentially random flat
      // colors, and global leveling blacks out patches it can't reconcile.
      // Disabling both leaves the raw best-view sample per face, which is
      // consistently correct — verified against a real capture where only
      // this combination produced a clean, fully photographic texture (see
      // `dev-tools`/`cli` `model-3d reconstruct`).
      '--global-seam-leveling',
      '0',
      '--local-seam-leveling',
      '0',
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
