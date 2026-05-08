import { Collaborator } from '@shared/models/auth/with-ownership';

import { ICollaborator } from '../../models/_collaborator';

export function toApiCollaborator(model: ICollaborator): Collaborator {
  return {
    user: model.user.toString(),
    permission: model.permission,
  };
}

export function toApiCollaborators(
  models: ICollaborator[] | undefined
): Collaborator[] {
  return (models ?? []).map(toApiCollaborator);
}
