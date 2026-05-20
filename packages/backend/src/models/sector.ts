import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

import { ownershipFields, WithOwnership } from './_collaborator';

export interface ISector extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  name: string;
  description?: string;
  isPrimary: boolean;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  images: Types.ObjectId[];
  models3d: Types.ObjectId[];
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
    models3d: {
      type: [Schema.Types.ObjectId],
      ref: 'Model3D',
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
