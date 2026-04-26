import { Document, model, Schema, Types, WithTimestamps } from 'mongoose';

import { collaboratorSchema, ICollaborator } from './_collaborator';

export interface ILocation extends WithTimestamps<Document> {
  /* Data */
  name: string;
  description?: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* Ownership */
  owner: Types.ObjectId;
  collaborators: ICollaborator[];

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
