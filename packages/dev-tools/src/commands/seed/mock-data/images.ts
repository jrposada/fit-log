import { faker } from '@faker-js/faker';
import { IImage } from '@backend/models/image';

export function fakeImage(): Partial<
  Omit<IImage, '_id' | 'createdAt' | 'updatedAt'>
> {
  const width = faker.number.int({ min: 800, max: 2400 });
  const height = faker.number.int({ min: 600, max: 1800 });
  return {
    imageUrl: faker.image.url({ width, height }),
    thumbnailUrl: faker.image.url({ width: 300, height: 300 }),
    imageWidth: width,
    imageHeight: height,
  };
}
