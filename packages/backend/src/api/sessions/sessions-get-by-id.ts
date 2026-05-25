import type {
  SessionsGetByIdParams,
  SessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Session } from '../../models/session.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSession } from './sessions-mapper.ts';

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
