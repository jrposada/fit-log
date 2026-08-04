// TODO: Atomic split

import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import { COLLABORATOR_PERMISSIONS } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { SchemaDefinition, Types } from 'mongoose';
import { Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { IUser } from './user.ts';

export type { CollaboratorPermission };
export { COLLABORATOR_PERMISSIONS };

export type CollaboratorPopulatedRefs = {
  user: IUser | null;
};

export type CollaboratorRequiredRefs = Exclude<
  keyof CollaboratorPopulatedRefs,
  ''
>;

export interface ICollaborator extends WithRefs<CollaboratorPopulatedRefs> {
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
