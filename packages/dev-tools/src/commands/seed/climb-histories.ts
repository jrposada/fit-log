import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { Climb } from '@backend/models/climb';
import { ClimbHistory, IClimbHistory } from '@backend/models/climb-history';
import { User } from '@backend/models/user';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { fakeClimbHistory } from './mock-data/climb-histories';

export interface SeedClimbHistoryOptions {
  owner: Types.ObjectId;
  climb: Types.ObjectId;
  /** Already-known location ref for the climb. Saves a lookup. */
  location: Types.ObjectId;
  /** Already-known sector ref for the climb. Saves a lookup. */
  sector: Types.ObjectId;
}

/**
 * Create one ClimbHistory document — a user's private log of attempts on
 * a climb. The (climb, owner) pair is uniquely indexed, so re-seeding for
 * the same pair will throw.
 */
export async function seedClimbHistory(
  opts: SeedClimbHistoryOptions
): Promise<IClimbHistory> {
  const data = fakeClimbHistory();
  const lastTry = data.tries[data.tries.length - 1];
  const mostRecentTryDate = lastTry?.date ?? new Date();

  return ClimbHistory.create({
    ...data,
    climb: opts.climb,
    location: opts.location,
    sector: opts.sector,
    owner: opts.owner,
    createdAt: mostRecentTryDate,
    updatedAt: mostRecentTryDate,
  });
}

interface SeedClimbHistoriesCliOptions {
  climb: string;
  ownerEmail: string;
}

export function registerSeedClimbHistoriesCommand(parent: Command): void {
  parent
    .command('climb-histories')
    .description(
      'Seed one climb history (a personal attempt log) for a given climb and owner'
    )
    .requiredOption('--climb <value>', 'Climb id (ObjectId)')
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedClimbHistoriesCliOptions) => {
      try {
        await connectToDatabase();

        const owner = await User.findOne({ email: options.ownerEmail });
        if (!owner) {
          throw new Error(
            `No Mongo user found with email "${options.ownerEmail}". ` +
              `Run \`dev-tools setup data\` first or pass a different --owner-email.`
          );
        }

        const climbId = new Types.ObjectId(options.climb);
        const climb = await Climb.findById(climbId);
        if (!climb) {
          throw new Error(`No climb found with id "${options.climb}".`);
        }
        if (!climb.location || !climb.sector) {
          throw new Error(
            `Climb "${options.climb}" is missing required location/sector refs.`
          );
        }

        await seedClimbHistory({
          owner: owner._id as Types.ObjectId,
          climb: climbId,
          location: climb.location,
          sector: climb.sector,
        });

        console.log(
          `✓ Seeded climb history for climb ${climb.name} owned by ${owner.email}`
        );
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
