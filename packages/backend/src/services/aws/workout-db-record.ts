export type WorkoutDbRecord = {
  PK: 'workout';

  /** workout#<user-id>#<workout-id> */
  SK: `workout#${string}#${string}`;

  name: string;
  description: string;
  exercises: Exercise[];
};

type Exercise = {
  description: string;
  intensity: number;
  intensityUnit: 'time' | 'weight' | 'body-weight';
  name: string;
  reps: number;
  restBetweenReps: number;
  restBetweenSets: number;
  sets: number;
  sort: number; // TODO: do we need this?
};
