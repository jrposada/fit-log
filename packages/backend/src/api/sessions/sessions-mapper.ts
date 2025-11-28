import { Session } from '@shared/models/session';

import { ISession } from '../../models/session';

function toApiSession(model: ISession): Session {
  return {
    id: model._id.toString(),
    completedAt: model.completedAt.toISOString(),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiSession };
