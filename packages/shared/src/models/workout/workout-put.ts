import z from 'zod';

import { exerciseSchema, Workout } from './workout';

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
