import { UserSummary } from '@shared/models/auth/user-summary';

import { IUser } from '../../models/user.ts';

export function toApiUserSummary(model: IUser): UserSummary {
  return {
    id: model._id.toString(),
    name: model.name,
  };
}
