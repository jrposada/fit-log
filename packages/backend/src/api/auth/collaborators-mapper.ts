import type {
  Collaborator,
  DepopulatedCollaborator,
} from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { MergeType } from 'mongoose';

import type { ICollaborator } from '../../models/_collaborator.ts';
import type { IUser } from '../../models/user.ts';
import { toApiUserSummary } from './user-summary-mapper.ts';

export function toApiDepopulatedCollaborator(
  model: ICollaborator
): DepopulatedCollaborator {
  return {
    user: model.user._id.toString(),
    permission: model.permission,
  };
}

export function toApiCollaborator(
  model: MergeType<ICollaborator, { user: IUser }>
): Collaborator {
  return {
    user: toApiUserSummary(model.user),
    permission: model.permission,
  };
}
