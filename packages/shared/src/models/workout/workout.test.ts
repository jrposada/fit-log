import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import {
  WorkoutsDeleteParams,
  workoutsDeleteParamsSchema,
} from './workout-delete';
import { WorkoutsGetQuery, workoutsGetQuerySchema } from './workout-get';
import {
  WorkoutsGetByIdParams,
  workoutsGetByIdParamsSchema,
} from './workout-get-by-id';
import { WorkoutsPutRequest, workoutsPutRequestSchema } from './workout-put';

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
