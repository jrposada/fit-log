import { ADMIN_ROLE } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Types } from 'mongoose';

import type { IUser } from '../models/user.ts';

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
