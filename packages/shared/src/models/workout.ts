import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';
import { IsEqual } from '../types/is-equal';
import { Expect } from '../types/expect';
import { IsTrue } from '../types/is-true';

export type Exercise = {
  /**
   * Number of sets.
   */
  sets: number;

  /**
   * Rest between sets (in seconds).
   */
  restBetweenSets: number;

  /**
   * Number of repetitions per set.
   */
  reps: number;

  /**
   * Rest between reps (in seconds).
   */
  restBetweenReps: number;

  /**
   * Represents either the weight (in kilograms) or the duration (in seconds) for the exercise.
   *
   * The meaning of this value depends on the {@link Exercise.intensityUnit}:
   * - If {@link Exercise.intensityUnit} is `time`, this value is interpreted as seconds.
   * - If {@link Exercise.intensityUnit} is `weight`, this value is interpreted as kilograms.
   */
  intensity: number;

  /**
   * Specifies the unit for the {@link Exercise.intensity} value.
   *
   * Use `time` for duration (in seconds) or `weight` for load (in kilograms).
   */
  intensityUnit: 'time' | 'weight';
};
export const exerciseSchema = z.object({
  sets: z.number(),
  restBetweenSets: z.number(),
  reps: z.number(),
  restBetweenReps: z.number(),
  intensity: z.number(),
  intensityUnit: z.union([z.literal('time'), z.literal('weight')]),
});
type ExerciseTest = Expect<
  IsTrue<IsEqual<Exercise, z.infer<typeof exerciseSchema>>>
>;

export type Workout = {
  /**
   * ID.
   *
   * @format uuid
   */
  id: string;

  /**
   * Name.
   */
  name: string;

  /**
   * Description.
   */
  description: string;

  /**
   * List of exercise.
   */
  exercises: Exercise[];
};
export const workoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  exercises: z.array(exerciseSchema),
});
type WorkoutTest = Expect<
  IsTrue<IsEqual<Workout, z.infer<typeof workoutSchema>>>
>;

export type WorkoutsGetResponse = {
  workouts: Workout[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

export type WorkoutsPutRequest = Omit<Workout, 'id'> & {
  /**
   * ID.
   *
   * @format uuid
   */
  id?: string;
};
export const workoutsPutRequestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  exercises: z.array(exerciseSchema),
});
type WorkoutsPutRequestTest = Expect<
  IsTrue<IsEqual<WorkoutsPutRequest, z.infer<typeof workoutsPutRequestSchema>>>
>;

export type WorkoutsPutResponse = {
  workout: Workout;
};
