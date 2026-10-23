import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import { SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import { TRAINING_PLAN_SLOTS } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import type {
  TrainingSessionItemLog,
  TrainingSessionItemLogSet,
  TrainingSessionPlanned,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import {
  SESSION_STALE_MS,
  TRAINING_SESSION_ITEM_LOG_STATUSES,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { IClimb } from './climb.ts';
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

export type ITrainingSessionPlanned = Omit<
  TrainingSessionPlanned,
  'enrollment'
> & {
  enrollment: Types.ObjectId;
};

const plannedSchema = new Schema<ITrainingSessionPlanned>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'PlanEnrollment',
      required: true,
    },
    sessionTemplateId: {
      type: String,
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    slot: {
      type: String,
      enum: TRAINING_PLAN_SLOTS,
      required: true,
    },
  },
  { _id: false }
);

const itemLogSetSchema = new Schema<TrainingSessionItemLogSet>(
  {
    reps: {
      type: Number,
      required: false,
    },
    weightKg: {
      type: Number,
      required: false,
    },
    holdS: {
      type: Number,
      required: false,
    },
    durationMin: {
      type: Number,
      required: false,
    },
    rpe: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

const itemLogSchema = new Schema<TrainingSessionItemLog>(
  {
    itemOrder: {
      type: Number,
      required: true,
    },
    exerciseId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: TRAINING_SESSION_ITEM_LOG_STATUSES,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    sets: {
      type: [itemLogSetSchema],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

export type TrainingSessionPopulatedRefs = {
  location: ILocation | null;
  climbHistories: IClimbHistory[];
  currentClimb: IClimb | null;
};

export type TrainingSessionRequiredRefs = Exclude<
  keyof TrainingSessionPopulatedRefs,
  'location' | 'currentClimb'
>;

export interface ITrainingSession
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithRefs<TrainingSessionPopulatedRefs> {
  /* Data */
  sport: Sport;
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  lastActivityAt: Date;
  planned?: ITrainingSessionPlanned;
  itemLogs: TrainingSessionItemLog[];
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
      enum: SPORTS,
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
    planned: {
      type: plannedSchema,
      required: false,
    },
    itemLogs: {
      type: [itemLogSchema],
      required: true,
      default: [],
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
    currentClimb: {
      type: Schema.Types.ObjectId,
      ref: 'Climb',
      required: false,
    },
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
