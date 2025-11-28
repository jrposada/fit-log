import { Document, model, Schema, WithTimestamps } from 'mongoose';

export interface ISession extends WithTimestamps<Document> {
  userId: string;
  workoutId: string;
  completedAt: Date;
  workoutName: string;
  workoutDescription: string;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    workoutId: {
      type: String,
      required: true,
      index: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
    },
    workoutDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying sessions by user and workout
// sessionSchema.index({ userId: 1, workoutId: 1 });
// sessionSchema.index({ userId: 1, completedAt: -1 });

export const Session = model<ISession>('Session', sessionSchema);
