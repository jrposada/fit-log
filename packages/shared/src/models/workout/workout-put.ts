import z from 'zod';

import { Workout } from './workout';

const exerciseSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  sort: z.number(),
  sets: z.number(),
  restBetweenSets: z.number(),
  reps: z.number(),
  restBetweenReps: z.number(),
  intensity: z.number(),
  intensityUnit: z.union([
    z.literal('time'),
    z.literal('weight'),
    z.literal('body-weight'),
  ]),
});

export type WorkoutsPutRequest = Omit<Workout, 'id' | 'isFavorite'> & {
  /**
   * ID `workout#<user-id>#<workout-id>`.
   */
  id?: string;
};
export const workoutsPutRequestSchema = z.object({
  id: z.string().nonempty().optional(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  exercises: z.array(exerciseSchema),
});

export type WorkoutsPutResponse = {
  workout: Workout;
};
