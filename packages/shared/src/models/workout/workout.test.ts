import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  WorkoutsDeleteParams,
  workoutsDeleteParamsSchema,
} from './workout-delete.ts';
import { WorkoutsGetQuery, workoutsGetQuerySchema } from './workout-get.ts';
import {
  WorkoutsGetByIdParams,
  workoutsGetByIdParamsSchema,
} from './workout-get-by-id.ts';
import { WorkoutsPutRequest, workoutsPutRequestSchema } from './workout-put.ts';

export type WorkoutsGetQueryTest = Expect<
  IsTrue<IsEqual<WorkoutsGetQuery, z.infer<typeof workoutsGetQuerySchema>>>
>;

export type WorkoutsPutRequestTest = Expect<
  IsTrue<IsEqual<WorkoutsPutRequest, z.infer<typeof workoutsPutRequestSchema>>>
>;

export type WorkoutsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<WorkoutsDeleteParams, z.infer<typeof workoutsDeleteParamsSchema>>
  >
>;

export type WorkoutsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<WorkoutsGetByIdParams, z.infer<typeof workoutsGetByIdParamsSchema>>
  >
>;
