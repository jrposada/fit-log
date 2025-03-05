export type WorkoutDbRecord = {
  PK: 'workout';

  /** workout#<user-id>#<workout-id> */
  SK: `workout#${string}#${string}`;

  name: string;
  description: string;
  exercises: Exercise[];
};

type Exercise = {
  intensity: number;
  intensityUnit: 'time' | 'weight';
  reps: number;
  restBetweenReps: number;
  restBetweenSets: number;
  sets: number;
  sort: number;
};
