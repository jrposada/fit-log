import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt';

export const STATUS_PRIORITY: Record<ClimbHistoryStatus, number> = {
  flash: 3,
  send: 2,
  attempt: 1,
};

export const STATUS_LIST = Object.keys(STATUS_PRIORITY) as ClimbHistoryStatus[];

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

  /* References */
  climb: Types.ObjectId;
  location: Types.ObjectId;
  sector: Types.ObjectId;
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
      enum: STATUS_LIST,
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
      enum: STATUS_LIST,
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
  },
  {
    timestamps: true,
  }
);

climbHistorySchema.index({ climb: 1 }, { unique: true });
climbHistorySchema.index({ location: 1 });
climbHistorySchema.index({ sector: 1 });
climbHistorySchema.index({ status: 1 });
climbHistorySchema.index({ isProject: 1 });
climbHistorySchema.index({ createdAt: -1 });

export const ClimbHistory = model<IClimbHistory>(
  'ClimbHistory',
  climbHistorySchema
);
