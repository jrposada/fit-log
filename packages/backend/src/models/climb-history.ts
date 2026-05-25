import type { ClimbHistoryStatus } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import { CLIMB_HISTORY_STATUSES } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

export type { ClimbHistoryStatus };

export const STATUS_PRIORITY: Record<ClimbHistoryStatus, number> = {
  flash: 3,
  send: 2,
  attempt: 1,
};

export interface IClimbHistoryTry {
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;
  date: Date;
}

export interface IClimbHistory extends WithTimestamps<Document> {
  /* Data */
  status: ClimbHistoryStatus;
  isProject: boolean;
  tries: Types.DocumentArray<IClimbHistoryTry>;

  /* Ownership */
  owner: Types.ObjectId;

  /* References – nullable after population if the referenced doc was deleted */
  climb: Types.ObjectId | null;
  location: Types.ObjectId | null;
  sector: Types.ObjectId | null;
  trainingSession: Types.ObjectId | null;
}

export function computeTopStatus(
  tries: { status: ClimbHistoryStatus }[]
): ClimbHistoryStatus {
  let best: ClimbHistoryStatus = tries[0]?.status ?? 'attempt';
  for (const t of tries) {
    if (STATUS_PRIORITY[t.status] > STATUS_PRIORITY[best]) {
      best = t.status;
    }
  }
  return best;
}

const climbHistoryTrySchema = new Schema<IClimbHistoryTry>(
  {
    status: {
      type: String,
      enum: [...CLIMB_HISTORY_STATUSES],
      required: true,
    },
    attempts: {
      type: Number,
      required: false,
      min: 1,
    },
    notes: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: true }
);

const climbHistorySchema = new Schema<IClimbHistory>(
  {
    /* Data */
    status: {
      type: String,
      enum: [...CLIMB_HISTORY_STATUSES],
      required: true,
    },
    isProject: {
      type: Boolean,
      required: true,
      default: false,
    },
    tries: {
      type: [climbHistoryTrySchema],
      required: true,
      default: [],
    },

    /* Ownership */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* References */
    climb: {
      type: Schema.Types.ObjectId,
      ref: 'Climb',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    sector: {
      type: Schema.Types.ObjectId,
      ref: 'Sector',
      required: true,
    },
    trainingSession: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingSession',
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

climbHistorySchema.index({ climb: 1, owner: 1 }, { unique: true });
climbHistorySchema.index({ owner: 1 });
climbHistorySchema.index({ location: 1 });
climbHistorySchema.index({ sector: 1 });
climbHistorySchema.index({ status: 1 });
climbHistorySchema.index({ isProject: 1 });
climbHistorySchema.index({ createdAt: -1 });
climbHistorySchema.index({ owner: 1, updatedAt: -1, _id: -1 });

export const ClimbHistory = model<IClimbHistory>(
  'ClimbHistory',
  climbHistorySchema
);
