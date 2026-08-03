import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { FilesService } from './files.ts';

export interface ProcessedModel3d {
  modelUrl: string;
  mimeType: string;
  fileSize: number;
  modelPath: string;
}

const EXTENSION_MAP: Record<string, string> = {
  'model/gltf-binary': '.glb',
  'model/gltf+json': '.gltf',
  'model/obj': '.obj',
  'model/stl': '.stl',
  'model/vnd.usdz+zip': '.usdz',
};

export class Model3dProcessor {
  private modelsDir: string;

  public static modelsDir(): string {
    return path.join(FilesService.publicDir(), 'model-3ds');
  }

  constructor() {
    this.modelsDir = path.join(FilesService.publicDir(), 'model-3ds');
  }

  async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.modelsDir, { recursive: true });
  }

  async processModelFromBase64(
    base64: string,
    mimeType: string
  ): Promise<ProcessedModel3d> {
    const buffer = Buffer.from(base64, 'base64');
    return this.processBuffer(buffer, mimeType);
  }

  async processModelFromBuffer(
    buffer: Buffer,
    mimeType: string
  ): Promise<ProcessedModel3d> {
    return this.processBuffer(buffer, mimeType);
  }

  private async processBuffer(
    buffer: Buffer,
    mimeType: string
  ): Promise<ProcessedModel3d> {
    await this.ensureDirectories();

    const extension = EXTENSION_MAP[mimeType] || '.glb';

    const fileId = uuid();
    const basename = `${fileId}${extension}`;
    const modelPath = path.join(this.modelsDir, basename);

    await fs.writeFile(modelPath, buffer);

    const modelUrl = `model-3ds/${basename}`;

    return {
      modelUrl,
      mimeType,
      fileSize: buffer.byteLength,
      modelPath,
    };
  }
}
