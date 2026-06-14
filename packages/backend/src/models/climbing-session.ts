import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

export const SESSION_STALE_MS = 4 * 60 * 60 * 1000;

export interface IClimbingSession extends WithTimestamps<Document> {
  /** Data */
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  lastActivityAt: Date;

  /* Ownership */
  owner: Types.ObjectId;

  /* References – nullable after population if the referenced doc was deleted */
  location: Types.ObjectId | null;
  climbHistories: Types.ObjectId[];
}

const climbingSessionSchema = new Schema<IClimbingSession>(
  {
    /* Data */
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      required: false,
    },
    lastActivityAt: {
      type: Date,
      required: true,
    },

    /* Ownership */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* References */
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    climbHistories: {
      type: [Schema.Types.ObjectId],
      ref: 'ClimbHistory',
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

climbingSessionSchema.index({ owner: 1 });

export const ClimbingSession = model<IClimbingSession>(
  'climbingSession',
  climbingSessionSchema
);
