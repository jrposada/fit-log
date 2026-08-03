import type { HoldType } from '@jrposada/fit-log-shared/common/climbs/holds';
import { HOLD_TYPES } from '@jrposada/fit-log-shared/common/climbs/holds';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export interface IHold {
  x: number;
  y: number;
  radius: number;
  type: HoldType;
}

export interface ISplinePoint {
  x: number;
  y: number;
}

export interface IClimb extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  name: string;
  grade: string;
  description?: string;
  holds: IHold[];
  spline: ISplinePoint[];
  source: string;
  sourceId?: string;

  /* References – nullable after population if the referenced doc was deleted */
  image: Types.ObjectId | null;
  location: Types.ObjectId | null;
  sector: Types.ObjectId | null;
}

const holdSchema = new Schema<IHold>(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: [...HOLD_TYPES],
      required: true,
    },
  },
  { _id: false }
);

const splinePointSchema = new Schema<ISplinePoint>(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const climbSchema = new Schema<IClimb>(
  {
    /* Data */
    name: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    holds: {
      type: [holdSchema],
      required: true,
      default: [],
    },
    spline: {
      type: [splinePointSchema],
      required: true,
      default: [],
    },
    source: {
      type: String,
      required: true,
      default: 'user',
    },
    sourceId: {
      type: String,
      required: false,
    },

    /* Ownership */
    ...ownershipFields,

    /* References */
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
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

export const Climb = model<IClimb>('Climb', climbSchema);
