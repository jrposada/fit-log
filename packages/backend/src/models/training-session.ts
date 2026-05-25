import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export const SESSION_STALE_MS = 4 * 60 * 60 * 1000;

export interface ITrainingSession
  extends WithTimestamps<Document>, WithOwnership {
  /** Data */
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  lastActivityAt: Date;

  /* References – nullable after population if the referenced doc was deleted */
  location: Types.ObjectId | null;
  climbHistories: Types.ObjectId[];
}

const trainingSessionSchema = new Schema<ITrainingSession>(
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
    ...ownershipFields,

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

export const TrainingSession = model<ITrainingSession>(
  'TrainingSession',
  trainingSessionSchema
);
