import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

export interface IHold {
  x: number;
  y: number;
  radius: number;
}

export interface ISplinePoint {
  x: number;
  y: number;
}

export interface IClimb extends WithTimestamps<Document> {
  /* Data */
  name: string;
  grade: string;
  description?: string;
  holds: IHold[];
  spline: ISplinePoint[];

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

climbSchema.index({ location: 1 });

export const Climb = model<IClimb>('Climb', climbSchema);
