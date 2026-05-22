import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

import { ownershipFields, WithOwnership } from './_collaborator';

export interface ILocation extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  name: string;
  description?: string;
  source: string;

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
    source: {
      type: String,
      required: true,
      default: 'user',
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

    /* Ownership */
    ...ownershipFields,

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
