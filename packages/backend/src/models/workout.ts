import { INTENSITY_UNITS } from '@jrposada/fit-log-shared/models/workout/workout';
import type { Document, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IExercise {
  description: string;
  intensity: number;
  intensityUnit: (typeof INTENSITY_UNITS)[number];
  name: string;
  reps: number;
  restBetweenReps: number;
  restBetweenSets: number;
  sets: number;
  sort: number;
}
const exerciseSchema = new Schema<IExercise>(
  {
    description: {
      type: String,
      required: true,
    },
    intensity: {
      type: Number,
      required: true,
    },
    intensityUnit: {
      type: String,
      enum: [...INTENSITY_UNITS],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    restBetweenReps: {
      type: Number,
      required: true,
    },
    restBetweenSets: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

export interface IWorkout extends WithTimestamps<Document> {
  name: string;
  description: string;
  exercises: IExercise[];
}
const workoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    exercises: {
      type: [exerciseSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Workout = model<IWorkout>('Workout', workoutSchema);
