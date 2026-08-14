import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export interface IModel3d
  extends WithTimestamps<Document<Types.ObjectId>>, WithOwnership {
  /* Data */
  modelUrl: string;
  mimeType: string;
  fileSize: number;
}

const model3dSchema = new Schema<IModel3d>(
  {
    /* Data */
    modelUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
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

export const Model3d = model<IModel3d>('Model3d', model3dSchema);
