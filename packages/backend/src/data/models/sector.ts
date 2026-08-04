import type { Document, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { Ref } from '../infrastructure/ref.ts';
import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';
import type { IClimb } from './climb.ts';
import type { IImage } from './image.ts';

type SectorPopulatedRefs = {
  images: IImage[];
  climbs: IClimb[];
};

export interface ISector
  extends WithTimestamps<Document>, WithOwnership, Ref<SectorPopulatedRefs> {
  /* Data */
  name: string;
  description?: string;
  isPrimary: boolean;
  source: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;
}

/**
 * `images` isn't included: the API shape always embeds images fully (they
 * have no further references to break), so it never collapses to an id
 * string the way `climbs` does.
 */
export type SectorRefs = 'climbs';

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
