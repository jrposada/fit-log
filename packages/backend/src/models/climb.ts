import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

export interface IHold {
  x: number;
  y: number;
}

export interface IClimb extends WithTimestamps<Document> {
  /* Data */
  name: string;
  grade: string;
  description?: string;
  holds: IHold[];

  /* References */
  image: Types.ObjectId;
  location: Types.ObjectId;
  sector: Types.ObjectId;
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
