export type Exercise = {
  name: string;
  description: string;
  sort: number;
  sets: number;
  restBetweenSets: number;
  reps: number;
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

export type Workout = {
  /**
   * ID `workout#<user-id>#<workout-id>`.
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

  /** Whether workouts has been added to favorites by current user. */
  isFavorite: boolean;
};
