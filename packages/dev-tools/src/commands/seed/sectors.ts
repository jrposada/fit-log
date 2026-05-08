import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { IClimb } from '@backend/models/climb';
import { Location } from '@backend/models/location';
import { ISector, Sector } from '@backend/models/sector';
import { User } from '@backend/models/user';
import { FilesService } from '@backend/services/files';
import { ImageProcessor } from '@backend/services/image-processor';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { seedClimb } from './climbs';
import { fakeSector } from './mock-data/sectors';

export interface SeedSectorOptions {
  owner: Types.ObjectId;
  /**
   * Optional parent location. When given, the new sector is also pushed
   * into `location.sectors`. Required for any climbs that get seeded so
   * they can carry the location ref.
   */
  location?: Types.ObjectId;
  /** How many climbs to seed inside this sector. Default 0. */
  climbsCount?: number;
  /**
   * Required when `climbsCount` > 0 — child climbs need to upload images
   * via the image processor.
   */
  imageProcessor?: ImageProcessor;
}

export interface SeedSectorResult {
  sector: ISector;
  climbs: IClimb[];
}

/**
 * Create one Sector document, optionally seeding child climbs and linking
 * the sector into a parent location.
 */
export async function seedSector(
  opts: SeedSectorOptions
): Promise<SeedSectorResult> {
  const sector = await Sector.create({ ...fakeSector(), owner: opts.owner });

  if (opts.location) {
    await Location.findByIdAndUpdate(opts.location, {
      $addToSet: { sectors: sector._id },
    });
  }

  const climbs: IClimb[] = [];
  const climbsCount = opts.climbsCount ?? 0;

  if (climbsCount > 0) {
    if (!opts.location) {
      throw new Error(
        'seedSector requires `location` when `climbsCount` > 0 (climbs need a location ref).'
      );
    }
    if (!opts.imageProcessor) {
      throw new Error(
        'seedSector requires `imageProcessor` when `climbsCount` > 0 (child climbs auto-seed images).'
      );
    }

    for (let i = 0; i < climbsCount; i++) {
      const climb = await seedClimb({
        owner: opts.owner,
        sector: sector._id as Types.ObjectId,
        location: opts.location,
        imageProcessor: opts.imageProcessor,
      });
      climbs.push(climb);
    }
  }

  return { sector, climbs };
}

interface SeedSectorsCliOptions {
  num: string;
  location: string;
  climbsPerSector: string;
  ownerEmail: string;
}

export function registerSeedSectorsCommand(parent: Command): void {
  parent
    .command('sectors')
    .description(
      'Seed N sectors under a given location, each with optional child climbs'
    )
    .option('--num <value>', 'Number of sectors to create', '2')
    .requiredOption(
      '--location <value>',
      'Location id (ObjectId) to attach sectors to'
    )
    .option(
      '--climbs-per-sector <value>',
      'Number of climbs to seed in each new sector',
      '0'
    )
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedSectorsCliOptions) => {
      const num = parseInt(options.num);
      const climbsPerSector = parseInt(options.climbsPerSector);

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

        const locationId = new Types.ObjectId(options.location);
        const location = await Location.findById(locationId);
        if (!location) {
          throw new Error(`No location found with id "${options.location}".`);
        }

        const imageProcessor =
          climbsPerSector > 0 ? new ImageProcessor() : undefined;

        let totalClimbs = 0;
        for (let i = 0; i < num; i++) {
          const { climbs } = await seedSector({
            owner: owner._id as Types.ObjectId,
            location: locationId,
            climbsCount: climbsPerSector,
            imageProcessor,
          });
          totalClimbs += climbs.length;
        }

        console.log(
          `✓ Seeded ${num} sectors under location ${location.name} owned by ${owner.email} (${totalClimbs} climbs total)`
        );
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
