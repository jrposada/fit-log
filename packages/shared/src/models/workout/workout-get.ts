import z from 'zod';

import { Workout } from './workout.ts';

export type WorkoutsGetQuery = {
  limit?: number;
  cursor?: string;
  onlyFavorites?: boolean;
};
export const workoutsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  onlyFavorites: z.boolean().optional(),
});

export type WorkoutsGetResponse = {
  workouts: Workout[];
  nextCursor: string | null;
};
