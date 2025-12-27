import {
  SessionsGetByIdParams,
  SessionsGetByIdResponse,
} from '@shared/models/session/session-get-by-id';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Session } from '../../models/session';
import { toApiResponse } from '../api-utils';
import { toApiSession } from './sessions-mapper';

const handler = toApiResponse<SessionsGetByIdResponse, SessionsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const session = await Session.findById(id);

    if (!session) {
      throw new ResourceNotFound(`Session with id ${id} not found`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          session: toApiSession(session),
        },
      },
    };
  }
);

export { handler };
