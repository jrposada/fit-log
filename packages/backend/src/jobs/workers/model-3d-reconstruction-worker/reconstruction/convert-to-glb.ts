import fs from 'node:fs/promises';

import obj2gltf from 'obj2gltf';

/**
 * Model3dProcessor stores a single buffer per model, so the multi-file OBJ +
 * MTL + texture that OpenMVS produces is bundled into one self-contained GLB
 * (embedded textures) before handing off to it.
 */
export async function convertObjToGlb(
  objPath: string,
  glbPath: string
): Promise<void> {
  const glb = (await obj2gltf(objPath, { binary: true })) as Buffer;
  await fs.writeFile(glbPath, glb);
}
