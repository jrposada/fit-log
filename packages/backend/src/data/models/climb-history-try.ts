import type { ClimbHistoryStatus } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import { CLIMB_HISTORY_STATUSES } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import { Schema } from 'mongoose';

export interface IClimbHistoryTry {
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;
  date: Date;
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

export { climbHistoryTrySchema };
