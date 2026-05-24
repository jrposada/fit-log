import {
  Collaborator,
  DepopulatedCollaborator,
} from '@jrposada/fit-log-shared/models/auth/with-ownership';
import { MergeType } from 'mongoose';

import { ICollaborator } from '../../models/_collaborator.ts';
import { IUser } from '../../models/user.ts';
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
