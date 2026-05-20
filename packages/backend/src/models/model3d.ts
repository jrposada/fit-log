import { Document, model, Schema, WithTimestamps } from 'mongoose';

import { ownershipFields, WithOwnership } from './_collaborator';

export interface IModel3D extends WithTimestamps<Document>, WithOwnership {
  /* Data */
  modelUrl: string;
  fileSize: number;
}

const model3dSchema = new Schema<IModel3D>(
  {
    /* Data */
    modelUrl: {
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

export const Model3D = model<IModel3D>('Model3D', model3dSchema);
