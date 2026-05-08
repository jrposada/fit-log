import { ADMIN_ROLE } from '@shared/models/auth/with-ownership';
import { Types } from 'mongoose';

import { IUser } from '../models/user';

type OwnerOrAdminFilter = {
  $or: Array<{ owner: Types.ObjectId } | Record<string, never>>;
};

/**
 * Mongo filter clause for documents whose access-list the user may
 * rewrite: owner only, or admin. Use when an action escalates access
 * (e.g. mutating `collaborators`) — an edit-collaborator must not be
 * able to do so.
 */
export function ownerOrAdminFilter(user: IUser): OwnerOrAdminFilter {
  const userId = user._id as Types.ObjectId;
  const isAdmin = user.roles.includes(ADMIN_ROLE);

  return {
    $or: [{ owner: userId }, ...(isAdmin ? [{}] : [])],
  };
}
