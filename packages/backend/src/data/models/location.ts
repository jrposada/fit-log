import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';
import type { ISector } from './sector.ts';

export type LocationPopulatedRefs = {
  sectors: ISector[];
};

export type LocationRequiredRefs = Exclude<keyof LocationPopulatedRefs, ''>;

export interface ILocation
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithOwnership,
    WithRefs<LocationPopulatedRefs> {
  /* Data */
  name: string;
  description?: string;
  source: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;
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
