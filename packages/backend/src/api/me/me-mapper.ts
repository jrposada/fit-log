import { MeResponse } from '@shared/models/auth/me';

import { IUser } from '../../models/user';

export function toApiMe(model: IUser): MeResponse {
  return {
    id: model._id.toString(),
    email: model.email,
    name: model.name,
    roles: model.roles,
  };
}
