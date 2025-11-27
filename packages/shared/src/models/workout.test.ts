import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Exercise,
  exerciseSchema,
  Workout,
  workoutSchema,
  WorkoutsGetParams,
  workoutsGetParamsSchema,
  WorkoutsPutRequest,
  workoutsPutRequestSchema,
} from './workout';

export type ExerciseTest = Expect<
  IsTrue<IsEqual<Exercise, z.infer<typeof exerciseSchema>>>
>;

export type WorkoutTest = Expect<
  IsTrue<IsEqual<Workout, z.infer<typeof workoutSchema>>>
>;

export type WorkoutsGetParamsTest = Expect<
  IsTrue<IsEqual<WorkoutsGetParams, z.infer<typeof workoutsGetParamsSchema>>>
>;

export type WorkoutsPutRequestTest = Expect<
  IsTrue<IsEqual<WorkoutsPutRequest, z.infer<typeof workoutsPutRequestSchema>>>
>;
