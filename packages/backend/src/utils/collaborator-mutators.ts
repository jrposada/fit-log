import { CollaboratorPermission } from '@shared/models/auth/with-ownership';
import { Document, Model, Types } from 'mongoose';

import { ownerOrAdminFilter } from '../auth/owner-or-admin-filter';
import { IUser } from '../models/user';

/**
 * Add or update a single collaborator on an ownership-aware document.
 *
 * Atomic: existing grant for `granteeId` is replaced; otherwise the new
 * grant is appended. Auth: only owner of the doc or admin (granting
 * access is an escalation, so edit-collaborators are not allowed).
 *
 * Returns a mongoose Query — chain `.populate(...)` and await as usual.
 * Resolves to `null` when the doc doesn't exist or the requester isn't
 * authorized; the caller decides 404 vs 403.
 */
export function addOrUpdateCollaborator<T extends Document>(
  model: Model<T>,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission,
  user: IUser
) {
  const granteeObjectId = new Types.ObjectId(granteeId);

  return model.findOneAndUpdate(
    { _id: id, ...ownerOrAdminFilter(user) },
    [
      {
        $set: {
          collaborators: {
            $concatArrays: [
              {
                $filter: {
                  input: '$collaborators',
                  cond: { $ne: ['$$this.user', granteeObjectId] },
                },
              },
              [{ user: granteeObjectId, permission }],
            ],
          },
        },
      },
    ],
    { new: true, runValidators: true }
  );
}

/**
 * Remove a collaborator from an ownership-aware document. Idempotent —
 * removing a non-existent grant is a no-op (still returns the doc).
 */
export function removeCollaborator<T extends Document>(
  model: Model<T>,
  id: string,
  granteeId: string,
  user: IUser
) {
  const granteeObjectId = new Types.ObjectId(granteeId);

  return model.findOneAndUpdate(
    { _id: id, ...ownerOrAdminFilter(user) },
    { $pull: { collaborators: { user: granteeObjectId } } },
    { new: true, runValidators: true }
  );
}
