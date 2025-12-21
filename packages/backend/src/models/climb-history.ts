import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt' | 'project';

export interface IClimbHistory extends WithTimestamps<Document> {
  /* Data */
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;

  /* References */
  climb: Types.ObjectId;
  location: Types.ObjectId;
  sector: Types.ObjectId;
}

const climbHistorySchema = new Schema<IClimbHistory>(
  {
    /* Data */
    status: {
      type: String,
      enum: ['send', 'flash', 'attempt', 'project'],
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

climbHistorySchema.index({ climb: 1 });
climbHistorySchema.index({ location: 1 });
climbHistorySchema.index({ sector: 1 });
climbHistorySchema.index({ status: 1 });
climbHistorySchema.index({ createdAt: -1 });
climbHistorySchema.index({ climb: 1, createdAt: -1 });

export const ClimbHistory = model<IClimbHistory>(
  'ClimbHistory',
  climbHistorySchema
);
