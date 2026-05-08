import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { Climb, IClimb } from '@backend/models/climb';
import { Location } from '@backend/models/location';
import { Sector } from '@backend/models/sector';
import { User } from '@backend/models/user';
import { FilesService } from '@backend/services/files';
import { ImageProcessor } from '@backend/services/image-processor';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { fakeClimb } from './mock-data/climbs';
import { seedImage } from './images';

export interface SeedClimbOptions {
  owner: Types.ObjectId;
  sector: Types.ObjectId;
  location: Types.ObjectId;
  /** Reuse an existing image. If omitted, seed a fresh one owned by `owner`. */
  image?: Types.ObjectId;
  /** Required when `image` is omitted (a new image will be seeded). */
  imageProcessor?: ImageProcessor;
}

/**
 * Create one Climb document, seeding a fresh Image if one isn't supplied,
 * and stitching the climb (and its image) into the parent sector's arrays.
 */
export async function seedClimb(opts: SeedClimbOptions): Promise<IClimb> {
  let imageId = opts.image;

  if (!imageId) {
    if (!opts.imageProcessor) {
      throw new Error(
        'seedClimb requires an `imageProcessor` when `image` is not supplied.'
      );
    }
    const image = await seedImage({
      owner: opts.owner,
      imageProcessor: opts.imageProcessor,
    });
    imageId = image._id as Types.ObjectId;
  }

  const climb = await Climb.create({
    ...fakeClimb(),
    owner: opts.owner,
    location: opts.location,
    sector: opts.sector,
    image: imageId,
  });

  await Sector.findByIdAndUpdate(opts.sector, {
    $addToSet: { climbs: climb._id, images: imageId },
  });

  return climb;
}

interface SeedClimbsCliOptions {
  num: string;
  sector: string;
  ownerEmail: string;
}

export function registerSeedClimbsCommand(parent: Command): void {
  parent
    .command('climbs')
    .description('Seed N climbs in a given sector for a given owner')
    .option('--num <value>', 'Number of climbs to create', '5')
    .requiredOption('--sector <value>', 'Sector id (ObjectId) to add climbs to')
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedClimbsCliOptions) => {
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

        const sectorId = new Types.ObjectId(options.sector);
        const sector = await Sector.findById(sectorId);
        if (!sector) {
          throw new Error(`No sector found with id "${options.sector}".`);
        }

        // Resolve the parent location via back-reference.
        const location = await Location.findOne({ sectors: sectorId });
        if (!location) {
          throw new Error(
            `Sector "${options.sector}" is not attached to any location.`
          );
        }

        const imageProcessor = new ImageProcessor();
        for (let i = 0; i < num; i++) {
          await seedClimb({
            owner: owner._id as Types.ObjectId,
            sector: sectorId,
            location: location._id as Types.ObjectId,
            imageProcessor,
          });
        }

        console.log(
          `✓ Seeded ${num} climbs in sector ${sector.name} (location ${location.name}) owned by ${owner.email}`
        );
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
