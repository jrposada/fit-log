import z from 'zod';

import { Workout } from './workout';

export type WorkoutsGetQuery = {
  limit?: number;
  onlyFavorites?: boolean;
};
export const workoutsGetQuerySchema = z.object({
  limit: z.number().optional(),
  onlyFavorites: z.boolean().optional(),
});

export type WorkoutsGetResponse = {
  workouts: Workout[];
};
