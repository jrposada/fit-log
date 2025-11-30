import { Document, model, Schema, WithTimestamps } from 'mongoose';

export interface ISession extends WithTimestamps<Document> {
  completedAt: Date;
}
const sessionSchema = new Schema<ISession>(
  {
    completedAt: {
      type: Date,
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
