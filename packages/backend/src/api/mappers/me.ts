import type { MeResponse } from '@jrposada/fit-log-shared/models/auth/me';

import type { IUser } from '../../data/models/user.ts';

export function toApiMe(model: IUser): MeResponse {
  return {
    id: model._id.toString(),
    email: model.email,
    name: model.name,
    roles: model.roles,
  };
}
