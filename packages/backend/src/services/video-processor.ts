import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { FilesService } from './files.ts';

export interface ProcessedVideo {
  /** Absolute path on disk — videos are never served to clients. */
  videoPath: string;
}

const EXTENSION_MAP: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
};

export class VideoProcessor {
  private videosDir: string;

  public static videosDir(): string {
    return path.join(FilesService.privateDir(), 'model-3d-videos');
  }

  constructor() {
    this.videosDir = VideoProcessor.videosDir();
  }

  async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.videosDir, { recursive: true });
  }

  async processVideoFromBase64(
    base64: string,
    mimeType: string
  ): Promise<ProcessedVideo> {
    const buffer = Buffer.from(base64, 'base64');
    await this.ensureDirectories();

    const extension = EXTENSION_MAP[mimeType] || '.mp4';
    const fileId = uuid();
    const basename = `${fileId}${extension}`;
    const videoPath = path.join(this.videosDir, basename);

    await fs.writeFile(videoPath, buffer);

    return { videoPath };
  }
}
