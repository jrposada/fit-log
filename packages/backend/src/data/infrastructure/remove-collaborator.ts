import type { Document, Model } from 'mongoose';
import { Types } from 'mongoose';

import { ownerOrAdminFilter } from '../../auth/owner-or-admin-filter.ts';
import type { IUser } from '../models/user.ts';

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
