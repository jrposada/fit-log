import { readFileSync } from 'node:fs';

import { normalizeTrainingPlanJson } from '../models/training-plans/normalize-training-plan-json.ts';
import {
  TrainingPlan,
  trainingPlanSchema,
} from '../models/training-plans/training-plan.ts';

// The CLI seed file is the only real plan, so specs run against it rather
// than a hand-written fixture that could drift from it.
const SEED_PATH = new URL(
  '../../../cli/src/commands/seed/data/climbing-plan.json',
  import.meta.url
);

export function loadSeedTrainingPlanJson(): unknown {
  return JSON.parse(readFileSync(SEED_PATH, 'utf8'));
}

export function loadSeedTrainingPlan(): TrainingPlan {
  return trainingPlanSchema.parse(
    normalizeTrainingPlanJson(loadSeedTrainingPlanJson())
  );
}
