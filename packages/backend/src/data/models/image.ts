import type { Document, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export interface IImage extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;
}

const imageSchema = new Schema<IImage>(
  {
    /* Data */
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    imageWidth: {
      type: Number,
      required: true,
    },
    imageHeight: {
      type: Number,
      required: true,
    },

    /* Ownership */
    ...ownershipFields,
  },
  {
    timestamps: true,
  }
);

export const Image = model<IImage>('Image', imageSchema);
