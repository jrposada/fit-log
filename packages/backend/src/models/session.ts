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

export const Session = model<ISession>('Session', sessionSchema);
