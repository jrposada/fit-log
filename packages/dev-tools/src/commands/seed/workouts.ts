import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { IWorkout, Workout } from '@backend/models/workout';
import type { Command } from 'commander';

import { fakeWorkout } from './mock-data/workouts';

export type SeedWorkoutOptions = Record<string, never>;

/**
 * Create one Workout document. Workouts have no ownership today, so the
 * options bag is empty — the helper exists for symmetry with the other
 * seeders so `setup data` can compose them uniformly.
 */
export async function seedWorkout(
  _opts: SeedWorkoutOptions = {}
): Promise<IWorkout> {
  return Workout.create(fakeWorkout());
}

interface SeedWorkoutsCliOptions {
  num: string;
}

export function registerSeedWorkoutsCommand(parent: Command): void {
  parent
    .command('workouts')
    .description('Seed N workouts (no ownership)')
    .option('--num <value>', 'Number of workouts to create', '5')
    .action(async (options: SeedWorkoutsCliOptions) => {
      const num = parseInt(options.num);

      try {
        await connectToDatabase();

        for (let i = 0; i < num; i++) {
          await seedWorkout();
        }

        console.log(`✓ Seeded ${num} workouts`);
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
