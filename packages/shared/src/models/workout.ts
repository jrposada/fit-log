import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

export type Exercise = {
  /**
   * Exercise name.
   */
  name: string;

  /**
   * Exercise description.
   */
  description: string;

  /**
   * Sort order against other exercises.
   */
  sort: number;

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
   * Use `time` for duration (in seconds), `weight` for load (in kilograms) or `body-weight` for load (in % of body weight).
   */
  intensityUnit: 'time' | 'weight' | 'body-weight';
};
export const exerciseSchema = z.object({
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
  id: z.string().uuid().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  exercises: z.array(exerciseSchema),
});

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
  id: z.string().uuid().nonempty().optional(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  exercises: z.array(exerciseSchema),
});

export type WorkoutsPutResponse = {
  workout: Workout;
};

export type WorkoutsDeleteResponse = undefined;
