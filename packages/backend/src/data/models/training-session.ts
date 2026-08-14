import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import { SESSION_STALE_MS } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { IClimbHistory } from './climb-history.ts';
import type { ILocation } from './location.ts';

export { SESSION_STALE_MS };
export type { SessionSummaryData };

export const EMPTY_TRAINING_SESSION_SUMMARY: SessionSummaryData = {
  headline: '0 routes',
  count: 0,
};

const sessionSummarySchema = new Schema<SessionSummaryData>(
  {
    headline: {
      type: String,
      required: true,
    },
    metric: {
      type: new Schema<NonNullable<SessionSummaryData['metric']>>(
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
        { _id: false }
      ),
      required: false,
    },
    count: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

export type TrainingSessionPopulatedRefs = {
  location: ILocation | null;
  climbHistories: IClimbHistory[];
};

export type TrainingSessionRequiredRefs = Exclude<
  keyof TrainingSessionPopulatedRefs,
  'location'
>;

export interface ITrainingSession
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithRefs<TrainingSessionPopulatedRefs> {
  /* Data */
  sport: 'climbing';
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  lastActivityAt: Date;
  /** Denormalized cache, recomputed by the owning sport package on every
   * write that touches the session's derived data. Never authoritative. */
  summary: SessionSummaryData;

  /* Ownership */
  owner: Types.ObjectId;
}

const trainingSessionSchema = new Schema<ITrainingSession>(
  {
    /* Data */
    sport: {
      type: String,
      enum: ['climbing'],
      required: true,
      default: 'climbing',
    },
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
    summary: {
      type: sessionSummarySchema,
      required: true,
      default: (): SessionSummaryData => ({
        ...EMPTY_TRAINING_SESSION_SUMMARY,
      }),
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
      required: false,
      default: null,
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

trainingSessionSchema.index({ owner: 1 });
// Feed keyset pagination: newest `startedAt` first, `_id` as tiebreaker.
trainingSessionSchema.index({ owner: 1, startedAt: -1, _id: -1 });

export const TrainingSession = model<ITrainingSession>(
  'TrainingSession',
  trainingSessionSchema
);
