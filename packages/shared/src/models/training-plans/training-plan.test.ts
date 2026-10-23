import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import { TrainingPlan, trainingPlanSchema } from './training-plan.ts';
import {
  TrainingPlansGetByIdParams,
  trainingPlansGetByIdParamsSchema,
} from './training-plans-get-by-id.ts';

export type TrainingPlanTest = Expect<
  IsTrue<IsEqual<TrainingPlan, z.infer<typeof trainingPlanSchema>>>
>;

export type TrainingPlansGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      TrainingPlansGetByIdParams,
      z.infer<typeof trainingPlansGetByIdParamsSchema>
    >
  >
>;
