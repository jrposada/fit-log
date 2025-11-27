import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  FavoriteWorkout,
  favoriteWorkoutSchema,
  FavoriteWorkoutsPutRequest,
  favoriteWorkoutsPutRequestSchema,
} from './favorite-workout';

export type FavoriteWorkoutTest = Expect<
  IsTrue<IsEqual<FavoriteWorkout, z.infer<typeof favoriteWorkoutSchema>>>
>;

export type FavoriteWorkoutsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      FavoriteWorkoutsPutRequest,
      z.infer<typeof favoriteWorkoutsPutRequestSchema>
    >
  >
>;
