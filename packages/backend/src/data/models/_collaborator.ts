// TODO: Atomic split

import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import { COLLABORATOR_PERMISSIONS } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { SchemaDefinition, Types } from 'mongoose';
import { Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { WithRequiredRefs } from '../infrastructure/with-required-refs.ts';
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
 * `collaborators` is a `WithOwnership` field, not a ref on the mixing-in
 * entity's own ref map (`ClimbPopulatedRefs` etc. never list it) — it's an
 * embedded array whose *elements* each carry a ref (`user`), which doesn't
 * fit the plain ref-array shape `WithRefs`/`RefsOf` model. So proving each
 * collaborator's own `user` FK is required can't be expressed by naming
 * `collaborators` as a `K` of `WithRequiredRefs<T, K>` alone — that only
 * gets you `NonNullable<T['collaborators']>`, a no-op on an array. This
 * composes `WithRequiredRefs`'s `Overrides` to state it once here, so
 * callers write `WithRequiredOwnership<WithRequiredRefs<IClimb,
 * ClimbRequiredRefs>>` instead of repeating the override per mapper.
 */
export type WithRequiredOwnership<T extends WithOwnership> = WithRequiredRefs<
  T,
  'collaborators',
  { collaborators: WithRequiredRefs<ICollaborator, CollaboratorRequiredRefs>[] }
>;

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
