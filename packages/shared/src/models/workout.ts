import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';

export type WorkoutsGetResponse = {
  workouts: Workout[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

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
