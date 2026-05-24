import { ADMIN_ROLE } from '@shared/models/auth/with-ownership';
import { Types } from 'mongoose';

type DeletableFilter = {
  $or: Array<
    | { owner: Types.ObjectId }
    | {
        collaborators: {
          $elemMatch: { user: Types.ObjectId; permission: 'delete' };
        };
      }
    | Record<string, never>
  >;
};

import { IUser } from '../models/user.ts';

/**
 * Mongo filter clause for documents the user can DELETE:
 * owner, collaborator with `delete` permission, or admin.
 *
 *   await Model.deleteOne({ _id: id, ...deletableBy(user) });
 */
export function deletableBy(user: IUser): DeletableFilter {
  const userId = user._id as Types.ObjectId;
  const isAdmin = user.roles.includes(ADMIN_ROLE);

  return {
    $or: [
      { owner: userId },
      {
        collaborators: {
          $elemMatch: { user: userId, permission: 'delete' },
        },
      },
      ...(isAdmin ? [{}] : []),
    ],
  };
}
