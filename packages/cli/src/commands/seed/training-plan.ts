import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  connectToDatabase,
  disconnectFromDatabase,
} from '../../utils/database';
import { TrainingPlan } from '@backend/data/models/training-plan';
import { normalizeTrainingPlanJson } from '@jrposada/fit-log-shared/models/training-plans/normalize-training-plan-json';
import { trainingPlanSchema } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import type { Command } from 'commander';

const DEFAULT_PLAN_PATH = path.resolve(
  fileURLToPath(import.meta.url),
  '../data/climbing-plan.json'
);

interface SeedTrainingPlanCliOptions {
  file: string;
}

export function registerSeedTrainingPlanCommand(parent: Command): void {
  parent
    .command('training-plan')
    .description('Upsert a training plan from its JSON seed file')
    .option('--file <path>', 'Path to the plan JSON file', DEFAULT_PLAN_PATH)
    .action(async (options: SeedTrainingPlanCliOptions) => {
      const filePath = path.resolve(options.file);
      const raw: unknown = JSON.parse(await fs.readFile(filePath, 'utf8'));

      const result = trainingPlanSchema.safeParse(
        normalizeTrainingPlanJson(raw)
      );
      if (!result.success) {
        console.error(`✗ Invalid training plan in ${filePath}:`);
        for (const issue of result.error.issues) {
          console.error(
            `  ${issue.path.join('.') || '(root)'}: ${issue.message}`
          );
        }
        process.exit(1);
      }

      const plan = result.data;
      try {
        await connectToDatabase();

        // Replace rather than merge so fields dropped from the file disappear.
        await TrainingPlan.findOneAndReplace({ id: plan.id }, plan, {
          upsert: true,
          runValidators: true,
        });

        console.log(
          `✓ Seeded training plan "${plan.id}" (${plan.durationWeeks} weeks, ` +
            `${plan.blocks.length} blocks, ${plan.sessionTemplates.length} session templates, ` +
            `${plan.exercises.length} exercises, ${plan.schedule.length} schedule entries, ` +
            `${plan.benchmarks.length} benchmarks)`
        );
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
