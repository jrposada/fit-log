import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

export interface ILocation extends WithTimestamps<Document> {
  /* Data */
  name: string;
  description?: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  sectors: Types.ObjectId[];
}
const locationSchema = new Schema<ILocation>(
  {
    /* Data */
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },

    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    googleMapsId: {
      type: String,
      required: false,
    },

    /* References */
    sectors: {
      type: [Schema.Types.ObjectId],
      ref: 'Sector',
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Location = model<ILocation>('Location', locationSchema);
