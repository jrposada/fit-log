import type {
  SessionsGetByIdParams,
  SessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getSessionById } from '../../../services/session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSession } from '../../mappers/sessions.ts';

const handler = toApiResponse<SessionsGetByIdResponse, SessionsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const session = await getSessionById(id);

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
