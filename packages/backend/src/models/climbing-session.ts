import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithSessionBase } from './_session-base.ts';
import { sessionBaseFields, sessionSummarySchema } from './_session-base.ts';

export const SESSION_STALE_MS = 4 * 60 * 60 * 1000;

export const EMPTY_CLIMBING_SESSION_SUMMARY: SessionSummaryData = {
  headline: '0 routes',
  count: 0,
};

export interface IClimbingSession
  extends WithTimestamps<Document>, WithSessionBase {
  /* Data */
  sport: 'climbing';
  lastActivityAt: Date;

  /* References – nullable after population if the referenced doc was deleted */
  climbHistories: Types.ObjectId[];
}

const climbingSessionSchema = new Schema<IClimbingSession>(
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
        ...EMPTY_CLIMBING_SESSION_SUMMARY,
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

climbingSessionSchema.index({ owner: 1 });
// Feed keyset pagination: newest `startedAt` first, `_id` as tiebreaker.
climbingSessionSchema.index({ owner: 1, startedAt: -1, _id: -1 });

export const ClimbingSession = model<IClimbingSession>(
  'climbingSession',
  climbingSessionSchema
);
