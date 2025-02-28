export type WorkoutDbRecord = {
  PK: 'workout';
  SK: string;

  name: string;
  description: string;
  exercises: Exercise[];
};

type Exercise = {
  sets: number;
  restBetweenSets: number;
  reps: number;
  restBetweenReps: number;
  intensity: number;
  intensityUnit: 'time' | 'weight';
};
