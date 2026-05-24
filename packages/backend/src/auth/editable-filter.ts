import { ADMIN_ROLE } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import { Types } from 'mongoose';

import { IUser } from '../models/user.ts';

type EditableFilter = {
  $or: Array<
    | { owner: Types.ObjectId }
    | {
        collaborators: {
          $elemMatch: { user: Types.ObjectId; permission: 'edit' };
        };
      }
    | Record<string, never>
  >;
};

/**
 * Mongo filter clause for documents the user can EDIT:
 * owner, collaborator with `edit` permission, or admin.
 *
 * `delete` permission does not imply `edit` — grant both as separate
 * entries on the collaborators array if a user needs both.
 *
 *   await Model.updateOne({ _id: id, ...editableBy(user) }, ...);
 */
export function editableBy(user: IUser): EditableFilter {
  const userId = user._id as Types.ObjectId;
  const isAdmin = user.roles.includes(ADMIN_ROLE);

  return {
    $or: [
      { owner: userId },
      {
        collaborators: {
          $elemMatch: { user: userId, permission: 'edit' },
        },
      },
      ...(isAdmin ? [{}] : []),
    ],
  };
}
