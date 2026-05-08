import {
  connectToDatabase,
  disconnectFromDatabase,
} from '@backend/database';
import { Image, IImage } from '@backend/models/image';
import { User } from '@backend/models/user';
import { FilesService } from '@backend/services/files';
import { ImageProcessor } from '@backend/services/image-processor';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { fakeImage } from './mock-data/images';

export interface SeedImageOptions {
  owner: Types.ObjectId;
  /** Reuse a single processor when seeding many images. */
  imageProcessor: ImageProcessor;
}

/**
 * Create one Image document owned by `owner`.
 * Bottom of the seeder dependency chain — has no other deps.
 */
export async function seedImage(opts: SeedImageOptions): Promise<IImage> {
  const data = await fakeImage(opts.imageProcessor);
  return Image.create({ ...data, owner: opts.owner });
}

interface SeedImagesCliOptions {
  num: string;
  ownerEmail: string;
}

export function registerSeedImagesCommand(parent: Command): void {
  parent
    .command('images')
    .description('Seed N images owned by a given user')
    .option('--num <value>', 'Number of images to create', '5')
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedImagesCliOptions) => {
      const num = parseInt(options.num);

      try {
        await connectToDatabase();
        await FilesService.ensureDirectories();

        const owner = await User.findOne({ email: options.ownerEmail });
        if (!owner) {
          throw new Error(
            `No Mongo user found with email "${options.ownerEmail}". ` +
              `Run \`dev-tools setup data\` first or pass a different --owner-email.`
          );
        }

        const imageProcessor = new ImageProcessor();
        for (let i = 0; i < num; i++) {
          await seedImage({
            owner: owner._id as Types.ObjectId,
            imageProcessor,
          });
        }

        console.log(`✓ Seeded ${num} images owned by ${owner.email}`);
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
