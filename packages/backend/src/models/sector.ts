import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

import { collaboratorSchema, ICollaborator } from './_collaborator';

export interface ISector extends WithTimestamps<Document> {
  /* Data */
  name: string;
  description?: string;
  isPrimary: boolean;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* Ownership */
  owner: Types.ObjectId;
  collaborators: ICollaborator[];

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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      required: true,
      default: [],
    },

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
