import { Document, model, ObjectId, Schema, WithTimestamps } from 'mongoose';

export interface IHold {
  x: number;
  y: number;
}

export interface IClimb extends WithTimestamps<Document> {
  //////////
  // Data //
  //////////
  name: string;
  grade: string;
  description?: string;
  holds: IHold[];

  ////////////////
  // References //
  ////////////////
  image: ObjectId;
  location: ObjectId;
  sector: ObjectId;
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
    //////////
    // Data //
    //////////
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

    ////////////////
    // References //
    ////////////////
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
    sector: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying climbs by location
// climbSchema.index({ locationId: 1 });
// climbSchema.index({ locationId: 1, grade: 1 });

export const Climb = model<IClimb>('Climb', climbSchema);
