import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { IClimb } from '@backend/models/climb';
import { ILocation, Location } from '@backend/models/location';
import { ISector } from '@backend/models/sector';
import { User } from '@backend/models/user';
import { FilesService } from '@backend/services/files';
import { ImageProcessor } from '@backend/services/image-processor';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { fakeLocation } from './mock-data/locations';
import { seedSector } from './sectors';

export interface SeedLocationOptions {
  owner: Types.ObjectId;
  /** How many sectors to seed inside this location. Default 0. */
  sectorsCount?: number;
  /** How many climbs to seed inside each child sector. Default 0. */
  climbsPerSector?: number;
  /** Required when seeding climbs (their images need a processor). */
  imageProcessor?: ImageProcessor;
}

export interface SeedLocationResult {
  location: ILocation;
  sectors: ISector[];
  climbs: IClimb[];
}

/**
 * Create one Location document, optionally seeding child sectors (and via
 * them, child climbs/images) — all owned by the same user.
 */
export async function seedLocation(
  opts: SeedLocationOptions
): Promise<SeedLocationResult> {
  const location = await Location.create({
    ...fakeLocation(),
    owner: opts.owner,
  });

  const sectors: ISector[] = [];
  const climbs: IClimb[] = [];
  const sectorsCount = opts.sectorsCount ?? 0;
  const climbsPerSector = opts.climbsPerSector ?? 0;

  if (sectorsCount > 0 && climbsPerSector > 0 && !opts.imageProcessor) {
    throw new Error(
      'seedLocation requires `imageProcessor` when child climbs are being seeded.'
    );
  }

  for (let i = 0; i < sectorsCount; i++) {
    const result = await seedSector({
      owner: opts.owner,
      location: location._id as Types.ObjectId,
      climbsCount: climbsPerSector,
      imageProcessor: opts.imageProcessor,
    });
    sectors.push(result.sector);
    climbs.push(...result.climbs);
  }

  return { location, sectors, climbs };
}

interface SeedLocationsCliOptions {
  num: string;
  sectorsPerLocation: string;
  climbsPerSector: string;
  ownerEmail: string;
}

export function registerSeedLocationsCommand(parent: Command): void {
  parent
    .command('locations')
    .description(
      'Seed N locations with optional child sectors / climbs (single owner)'
    )
    .option('--num <value>', 'Number of locations to create', '1')
    .option(
      '--sectors-per-location <value>',
      'Number of sectors to seed in each new location',
      '2'
    )
    .option(
      '--climbs-per-sector <value>',
      'Number of climbs to seed in each new sector',
      '5'
    )
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedLocationsCliOptions) => {
      const num = parseInt(options.num);
      const sectorsPerLocation = parseInt(options.sectorsPerLocation);
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

        const imageProcessor =
          sectorsPerLocation > 0 && climbsPerSector > 0
            ? new ImageProcessor()
            : undefined;

        let totalSectors = 0;
        let totalClimbs = 0;
        for (let i = 0; i < num; i++) {
          const { sectors, climbs } = await seedLocation({
            owner: owner._id as Types.ObjectId,
            sectorsCount: sectorsPerLocation,
            climbsPerSector,
            imageProcessor,
          });
          totalSectors += sectors.length;
          totalClimbs += climbs.length;
        }

        console.log(
          `✓ Seeded ${num} locations owned by ${owner.email} ` +
            `(${totalSectors} sectors, ${totalClimbs} climbs)`
        );
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
