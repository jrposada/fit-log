import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';
import type { IClimb } from './climb.ts';
import type { IImage } from './image.ts';
import type { IModel3d } from './model-3d.ts';

export type SectorPopulatedRefs = {
  images: IImage[];
  models3d: IModel3d[];
  climbs: IClimb[];
};

export type SectorRequiredRefs = Exclude<keyof SectorPopulatedRefs, ''>;

export interface ISector
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithOwnership,
    WithRefs<SectorPopulatedRefs> {
  /* Data */
  name: string;
  description?: string;
  isPrimary: boolean;
  source: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;
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
    models3d: {
      type: [Schema.Types.ObjectId],
      ref: 'Model3d',
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
