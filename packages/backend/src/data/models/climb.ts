import type { HoldType } from '@jrposada/fit-log-shared/common/climbs/holds';
import { HOLD_TYPES } from '@jrposada/fit-log-shared/common/climbs/holds';
import type { Document, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';
import type { ILocation } from './location.ts';
import type { IModel3d } from './model-3d.ts';
import type { ISector } from './sector.ts';

export interface IHold {
  x: number;
  y: number;
  radius: number;
  type: HoldType;
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

export interface ISplinePoint {
  x: number;
  y: number;
}

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

export type ClimbPopulatedRefs = {
  image: IClimb | null;
  location: ILocation | null;
  sector: ISector | null;
  model3d: IModel3d | null;
};

export type ClimbRequiredRefs = Exclude<
  keyof ClimbPopulatedRefs,
  'image' | 'model3d'
>;

export interface IClimb
  extends
    WithTimestamps<Document>,
    WithOwnership,
    WithRefs<ClimbPopulatedRefs> {
  /* Data */
  name: string;
  grade: string;
  description?: string;
  holds: IHold[];
  spline: ISplinePoint[];
  source: string;
  sourceId?: string;
}

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
      required: false,
      default: null,
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
    model3d: {
      type: Schema.Types.ObjectId,
      ref: 'Model3d',
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Climb = model<IClimb>('Climb', climbSchema);
