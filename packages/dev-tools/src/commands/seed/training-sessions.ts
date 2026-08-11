import {
  connectToDatabase,
  disconnectFromDatabase,
} from '../../utils/database';
import { IClimb } from '@backend/data/models/climb';
import {
  ClimbHistory,
  IClimbHistory,
} from '@backend/data/models/climb-history';
import {
  ITrainingSession,
  TrainingSession,
} from '@backend/data/models/training-session';
import { User } from '@backend/data/models/user';
import { computeTrainingSessionSummary } from '@backend/services/training-session';
import { faker } from '@faker-js/faker';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { fakeTrainingSession } from './mock-data/training-sessions';

export interface SeedTrainingSessionOptions {
  owner: Types.ObjectId;
  location?: Types.ObjectId | null;
  /** Climb histories to attach, paired with their climb (needed to compute
   * the denormalized summary). Each history gets stamped with this
   * session's id, mirroring the real add-to-session flow. */
  climbHistories?: { history: IClimbHistory; climb: IClimb | null }[];
}

/**
 * Create one TrainingSession document. When climb histories are supplied,
 * `startedAt`/`endedAt` are derived from their try dates and the
 * denormalized `summary` is computed the same way the API does; otherwise
 * the session is a standalone, history-less entry.
 */
export async function seedTrainingSession(
  opts: SeedTrainingSessionOptions
): Promise<ITrainingSession> {
  const climbHistories = opts.climbHistories ?? [];

  const tryDates = climbHistories
    .flatMap(({ history }) => history.tries.map((t) => t.date))
    .sort((a, b) => a.getTime() - b.getTime());
  const startedAt = tryDates[0] ?? faker.date.recent({ days: 60 });
  const endedAt = tryDates[tryDates.length - 1] ?? startedAt;

  const session = await TrainingSession.create({
    ...fakeTrainingSession(),
    owner: opts.owner,
    location: opts.location ?? null,
    climbHistories: climbHistories.map(({ history }) => history._id),
    startedAt,
    endedAt,
    lastActivityAt: endedAt,
    summary: computeTrainingSessionSummary(
      climbHistories.map(({ history, climb }) => ({
        status: history.status,
        climb,
      }))
    ),
  });

  if (climbHistories.length > 0) {
    await ClimbHistory.updateMany(
      { _id: { $in: climbHistories.map(({ history }) => history._id) } },
      { $set: { trainingSession: session._id } }
    );
  }

  return session;
}

interface SeedTrainingSessionsCliOptions {
  ownerEmail: string;
}

export function registerSeedTrainingSessionsCommand(parent: Command): void {
  parent
    .command('training-sessions')
    .description('Seed one standalone (history-less) training session')
    .option(
      '--owner-email <value>',
      'Email of the owning Mongo user',
      'dev@example.com'
    )
    .action(async (options: SeedTrainingSessionsCliOptions) => {
      try {
        await connectToDatabase();

        const owner = await User.findOne({ email: options.ownerEmail });
        if (!owner) {
          throw new Error(
            `No Mongo user found with email "${options.ownerEmail}". ` +
              `Run \`dev-tools setup data\` first or pass a different --owner-email.`
          );
        }

        await seedTrainingSession({ owner: owner._id });

        console.log(`✓ Seeded training session owned by ${owner.email}`);
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
