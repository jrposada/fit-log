import type {
  SessionsGetQuery,
  SessionsGetResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getSessions } from '../../../services/session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSession } from '../../mappers/sessions.ts';

const handler = toApiResponse<SessionsGetResponse, unknown, SessionsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const sessions = await getSessions(limit);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sessions: sessions.map(toApiSession),
        },
      },
    };
  }
);

export { handler };
