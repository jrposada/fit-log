import type { UserSummary } from '@jrposada/fit-log-shared/models/auth/user-summary';

import type { IUser } from '../../models/user.ts';

export function toApiUserSummary(model: IUser): UserSummary {
  return {
    id: model._id.toString(),
    name: model.name,
  };
}
