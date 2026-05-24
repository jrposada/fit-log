import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export interface ISector extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  name: string;
  description?: string;
  isPrimary: boolean;
  source: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  images: Types.ObjectId[];
  climbs: Types.ObjectId[];
}
const sectorSchema = new Schema<ISector>(
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
    isPrimary: {
      type: Boolean,
      required: false,
      default: false,
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
    images: {
      type: [Schema.Types.ObjectId],
      ref: 'Image',
      required: true,
      default: [],
    },
    climbs: {
      type: [Schema.Types.ObjectId],
      ref: 'Climb',
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Sector = model<ISector>('Sector', sectorSchema);
