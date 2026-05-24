import { Session } from '@jrposada/fit-log-shared/models/session/session';

import { ISession } from '../../models/session.ts';

function toApiSession(model: ISession): Session {
  return {
    id: model._id.toString(),
    completedAt: model.completedAt.toISOString(),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiSession };
