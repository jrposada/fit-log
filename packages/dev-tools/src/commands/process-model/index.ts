import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import AdmZip from 'adm-zip';
import type { Command } from 'commander';
import sharp from 'sharp';

// obj2gltf is CJS-only, use createRequire for ESM compatibility
const require = createRequire(import.meta.url);
const obj2gltf = require('obj2gltf') as (
  inputPath: string,
  options?: Record<string, unknown>
) => Promise<Buffer>;

// UDIM tile number → { uOffset, vOffset }
function parseTileOffset(tileNum: number): { u: number; v: number } {
  const offset = tileNum - 1001;
  return { u: offset % 10, v: Math.floor(offset / 10) };
}

export default function registerProcessModelCommand(program: Command): void {
  program
    .command('process-model')
    .description(
      'Preprocess a 3D model ZIP (OBJ + UDIM textures) → stitched-texture GLB'
    )
    .requiredOption(
      '--input <path>',
      'Path to ZIP containing lowpoly.obj and UDIM texture_XXXX.jpg files'
    )
    .option(
      '--output <path>',
      'Output GLB file path',
      path.join(
        process.env.DATA_DIR ?? '.',
        'public',
        'models',
        'parmasoni.glb'
      )
    )
    .option('--tile-size <px>', 'Per-tile output resolution (square)', '1024')
    .action(async (options: { input: string; output: string; tileSize: string }) => {
      const tileSize = parseInt(options.tileSize, 10);
      const inputPath = path.resolve(options.input);
      const outputPath = path.resolve(options.output);

      console.log(`Input:     ${inputPath}`);
      console.log(`Output:    ${outputPath}`);
      console.log(`Tile size: ${tileSize}px`);

      const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'fit-log-model-'));
      console.log(`Temp dir:  ${tmpDir}`);

      try {
        // 1. Extract OBJ and textures from ZIP
        console.log('\n[1/5] Extracting ZIP...');
        const zip = new AdmZip(inputPath);
        const entries = zip.getEntries();

        let objEntry: AdmZip.IZipEntry | undefined;
        const tileEntries: Map<number, AdmZip.IZipEntry> = new Map();

        for (const entry of entries) {
          const name = path.basename(entry.entryName);
          if (name.toLowerCase().endsWith('.obj')) {
            objEntry = entry;
          }
          const tileMatch = name.match(/texture_(\d{4})\.(jpg|jpeg)$/i);
          if (tileMatch?.[1]) {
            tileEntries.set(parseInt(tileMatch[1], 10), entry);
          }
        }

        if (!objEntry) throw new Error('No .obj file found in ZIP');
        if (tileEntries.size === 0) throw new Error('No texture_XXXX.jpg files found in ZIP');

        const objRawPath = path.join(tmpDir, 'source.obj');
        zip.extractEntryTo(objEntry, tmpDir, false, true, false, 'source.obj');
        console.log(`  Extracted OBJ: ${path.basename(objEntry.entryName)} (${(objEntry.header.size / 1024 / 1024).toFixed(1)} MB)`);

        const tileNums = [...tileEntries.keys()].sort((a, b) => a - b);
        console.log(`  Found tiles: ${tileNums.join(', ')}`);

        // Determine atlas layout from tile numbers
        const maxU = Math.max(...tileNums.map((t) => parseTileOffset(t).u));
        const maxV = Math.max(...tileNums.map((t) => parseTileOffset(t).v));
        const numUTiles = maxU + 1;
        const numVTiles = maxV + 1;
        console.log(`  Atlas layout: ${numUTiles} wide × ${numVTiles} tall`);

        // Extract texture files
        const tilePaths = new Map<number, string>();
        for (const [tileNum, entry] of tileEntries) {
          const tileName = `tile_${tileNum}.jpg`;
          zip.extractEntryTo(entry, tmpDir, false, true, false, tileName);
          tilePaths.set(tileNum, path.join(tmpDir, tileName));
        }

        // 2. Stitch textures into atlas
        console.log('\n[2/5] Stitching UDIM textures into atlas...');
        const atlasWidth = tileSize * numUTiles;
        const atlasHeight = tileSize * numVTiles;

        const compositeInputs: sharp.OverlayOptions[] = [];
        for (const [tileNum, tilePath] of tilePaths) {
          const { u, v } = parseTileOffset(tileNum);
          const resized = await sharp(tilePath)
            .resize(tileSize, tileSize, { fit: 'fill' })
            .toBuffer();
          compositeInputs.push({
            input: resized,
            left: u * tileSize,
            // UDIM v=0 is the bottom row; image coords have y=0 at top → flip v
            top: (numVTiles - 1 - v) * tileSize,
          });
        }

        const atlasPath = path.join(tmpDir, 'parmasoni_texture.jpg');
        await sharp({
          create: {
            width: atlasWidth,
            height: atlasHeight,
            channels: 3,
            background: { r: 0, g: 0, b: 0 },
          },
        })
          .composite(compositeInputs)
          .jpeg({ quality: 90 })
          .toFile(atlasPath);
        console.log(`  Atlas: ${atlasWidth}×${atlasHeight}px → ${atlasPath}`);

        // 3. Remap OBJ UV coordinates and unify material
        console.log('\n[3/5] Remapping OBJ UV coordinates...');
        const remappedObjPath = path.join(tmpDir, 'parmasoni_remapped.obj');
        await remapObjUVs(objRawPath, remappedObjPath, numUTiles, numVTiles);

        // 4. Write MTL file
        console.log('\n[4/5] Writing MTL file...');
        const mtlPath = path.join(tmpDir, 'parmasoni.mtl');
        await fsp.writeFile(
          mtlPath,
          'newmtl material0\nmap_Kd parmasoni_texture.jpg\n'
        );

        // 5. Convert OBJ → GLB
        console.log('\n[5/5] Converting OBJ → GLB (this may take a while)...');
        const glb = await obj2gltf(remappedObjPath, {
          binary: true,
          inputUpAxis: 'Y',
          outputUpAxis: 'Y',
        });

        await fsp.mkdir(path.dirname(outputPath), { recursive: true });
        await fsp.writeFile(outputPath, Buffer.from(glb));
        const sizeMB = ((await fsp.stat(outputPath)).size / 1024 / 1024).toFixed(1);
        console.log(`\n✓ GLB written: ${outputPath} (${sizeMB} MB)`);
      } finally {
        await fsp.rm(tmpDir, { recursive: true, force: true });
      }

      process.exit(0);
    });
}

async function remapObjUVs(
  inputPath: string,
  outputPath: string,
  numUTiles: number,
  numVTiles: number
): Promise<void> {
  const rl = createInterface({ input: fs.createReadStream(inputPath) });
  const out = fs.createWriteStream(outputPath);

  let uvCount = 0;
  let mtllibWritten = false;

  await new Promise<void>((resolve, reject) => {
    out.on('error', reject);

    rl.on('line', (line) => {
      if (line.startsWith('mtllib ')) {
        // Replace with our MTL reference (written once before first non-comment line)
        return;
      }

      // Write our mtllib before the first non-comment content line
      if (!mtllibWritten && line.length > 0 && !line.startsWith('#')) {
        out.write('mtllib parmasoni.mtl\n');
        mtllibWritten = true;
      }

      if (line.startsWith('vt ')) {
        const parts = line.split(/\s+/);
        const u = parseFloat(parts[1] ?? '0');
        const v = parseFloat(parts[2] ?? '0');
        out.write(`vt ${u / numUTiles} ${v / numVTiles}\n`);
        uvCount++;
      } else if (line.startsWith('usemtl ')) {
        out.write('usemtl material0\n');
      } else {
        out.write(line + '\n');
      }
    });

    rl.on('close', () => {
      out.end(() => {
        console.log(`  Remapped ${uvCount} UV coordinates`);
        resolve();
      });
    });

    rl.on('error', reject);
  });
}
