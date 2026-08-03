import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import { SESSION_STALE_MS } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithSessionBase } from './_session-base.ts';
import { sessionBaseFields, sessionSummarySchema } from './_session-base.ts';

export { SESSION_STALE_MS };

export const EMPTY_TRAINING_SESSION_SUMMARY: SessionSummaryData = {
  headline: '0 routes',
  count: 0,
};

export interface ITrainingSession
  extends WithTimestamps<Document>, WithSessionBase {
  /* Data */
  sport: 'climbing';
  lastActivityAt: Date;

  /* References */
  climbHistories: Types.ObjectId[];
}

/**
 * `location` (inherited from `WithSessionBase`) isn't included: the API
 * shape depopulates it to an optional property (`location?:`) rather than a
 * nullable one, which the generic helper's null-check can't express — the
 * mapper composes that one by hand instead.
 */
export type TrainingSessionRefs = 'climbHistories';

const trainingSessionSchema = new Schema<ITrainingSession>(
  {
    /* Session contract */
    ...sessionBaseFields,
    sport: {
      type: String,
      enum: ['climbing'],
      required: true,
      default: 'climbing',
    },
    summary: {
      type: sessionSummarySchema,
      required: true,
      default: (): SessionSummaryData => ({
        ...EMPTY_TRAINING_SESSION_SUMMARY,
      }),
    },

    /* Data */
    lastActivityAt: {
      type: Date,
      required: true,
    },

    /* References */
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

trainingSessionSchema.index({ owner: 1 });
// Feed keyset pagination: newest `startedAt` first, `_id` as tiebreaker.
trainingSessionSchema.index({ owner: 1, startedAt: -1, _id: -1 });

export const TrainingSession = model<ITrainingSession>(
  'TrainingSession',
  trainingSessionSchema
);
