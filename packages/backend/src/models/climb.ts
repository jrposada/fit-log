import { HOLD_TYPES, HoldType } from '@shared/models/climb/climb';
import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

import { ownershipFields, WithOwnership } from './_collaborator';

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

  /* References – nullable after population if the referenced doc was deleted */
  model3d?: Types.ObjectId | null;
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

    /* Ownership */
    ...ownershipFields,

    /* References */
    model3d: {
      type: Schema.Types.ObjectId,
      ref: 'Model3D',
      required: false,
    },
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
