import {
  COLLABORATOR_PERMISSIONS,
  CollaboratorPermission,
} from '@shared/models/auth/with-ownership';
import { Schema, SchemaDefinition, Types } from 'mongoose';

export type { CollaboratorPermission };
export { COLLABORATOR_PERMISSIONS };

export interface ICollaborator {
  user: Types.ObjectId;
  permission: CollaboratorPermission;
}

export const collaboratorSchema = new Schema<ICollaborator>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: [...COLLABORATOR_PERMISSIONS],
      required: true,
    },
  },
  { _id: false }
);

/**
 * Marker interface for models that have ownership semantics.
 * Combine with `WithTimestamps<Document>`:
 *   interface IClimb extends WithTimestamps<Document>, WithOwnership { ... }
 */
export interface WithOwnership {
  owner: Types.ObjectId;
  collaborators: ICollaborator[];
}

/**
 * Schema field definitions for `WithOwnership`. Spread into a model's
 * schema definition object:
 *   new Schema<IClimb>({ ...ownershipFields, name: { ... }, ... });
 */
export const ownershipFields: SchemaDefinition<WithOwnership> = {
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
};
