import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { FilesService } from './files';

export interface ProcessedImage {
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;
  imagePath: string;
  thumbnailPath: string;
}

export class ImageProcessor {
  private fullImagesDir: string;
  private thumbnailsDir: string;

  public static imagesDir(): string {
    return path.join(FilesService.publicDir(), 'images');
  }

  constructor() {
    const baseDir = path.join(FilesService.publicDir(), 'images');

    this.fullImagesDir = path.join(baseDir, 'full');
    this.thumbnailsDir = path.join(baseDir, 'thumbnails');
  }

  async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.fullImagesDir, { recursive: true });
    await fs.mkdir(this.thumbnailsDir, { recursive: true });
  }

  async processImage(tempFilePath: string): Promise<ProcessedImage> {
    await this.ensureDirectories();

    const fileId = path.basename(tempFilePath, path.extname(tempFilePath));
    const extension = path.extname(tempFilePath).toLowerCase();
    const fullImageBasename = `${fileId}${extension}`;

    const fullImagePath = path.join(this.fullImagesDir, fullImageBasename);
    const imageInfo = await sharp(tempFilePath)
      .resize(2048, 2048, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(fullImagePath);

    const thumbnailBasename = `${fileId}_thumb${extension}`;
    const thumbnailPath = path.join(this.thumbnailsDir, thumbnailBasename);
    await sharp(tempFilePath)
      .resize(400, 400, {
        fit: 'cover',
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    await fs.unlink(tempFilePath);

    const imageUrl = `images/full/${fullImageBasename}`;
    const thumbnailUrl = `images/thumbnails/${thumbnailBasename}`;

    return {
      imageUrl,
      thumbnailUrl,
      imageWidth: imageInfo.width,
      imageHeight: imageInfo.height,
      imagePath: fullImagePath,
      thumbnailPath,
    };
  }

  async deleteImage(imagePath: string, thumbnailPath: string): Promise<void> {
    try {
      await fs.unlink(imagePath);
      await fs.unlink(thumbnailPath);
    } catch (error) {
      console.error('Failed to delete image files:', error);
      // Don't throw - allow database cleanup to continue even if file deletion fails
    }
  }
}
