import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Document, Model } from 'mongoose';
import { Types } from 'mongoose';

import { ownerOrAdminFilter } from '../../auth/owner-or-admin-filter.ts';
import type { IUser } from '../models/user.ts';

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
export function upsertCollaborator<T extends Document>(
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
