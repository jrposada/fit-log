import type { Model3dStatus } from '@jrposada/fit-log-shared/common/model-3d/model-3d-statuses';
import { MODEL_3D_STATUSES } from '@jrposada/fit-log-shared/common/model-3d/model-3d-statuses';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithOwnership } from './_collaborator.ts';
import { ownershipFields } from './_collaborator.ts';

export interface IModel3d
  extends WithTimestamps<Document<Types.ObjectId>>, WithOwnership {
  /* Data */
  status: Model3dStatus;
  /** Set once `status` is 'ready'. */
  modelUrl?: string;
  mimeType?: string;
  fileSize?: number;
  /** Set once `status` is 'failed'. */
  error?: string;
}

const model3dSchema = new Schema<IModel3d>(
  {
    /* Data */
    status: {
      type: String,
      enum: [...MODEL_3D_STATUSES],
      required: true,
      default: 'ready',
    },
    modelUrl: {
      type: String,
      required: false,
    },
    mimeType: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    error: {
      type: String,
      required: false,
    },

    /* Ownership */
    ...ownershipFields,
  },
  {
    timestamps: true,
  }
);

export const Model3d = model<IModel3d>('Model3d', model3dSchema);
