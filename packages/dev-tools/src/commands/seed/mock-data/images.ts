import { faker } from '@faker-js/faker';
import { IImage } from '@backend/models/image';
import { ImageProcessor } from '@backend/services/image-processor';
import sharp from 'sharp';

export async function fakeImage(
  imageProcessor: ImageProcessor
): Promise<Partial<Omit<IImage, '_id' | 'createdAt' | 'updatedAt'>>> {
  const width = faker.number.int({ min: 800, max: 2400 });
  const height = faker.number.int({ min: 600, max: 1800 });

  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: {
        r: faker.number.int({ min: 0, max: 255 }),
        g: faker.number.int({ min: 0, max: 255 }),
        b: faker.number.int({ min: 0, max: 255 }),
      },
    },
  })
    .jpeg()
    .toBuffer();

  const processed = await imageProcessor.processImageFromBuffer(
    buffer,
    'image/jpeg'
  );

  return {
    imageUrl: processed.imageUrl,
    thumbnailUrl: processed.thumbnailUrl,
    imageWidth: processed.imageWidth,
    imageHeight: processed.imageHeight,
  };
}
