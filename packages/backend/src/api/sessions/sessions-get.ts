import type {
  SessionsGetQuery,
  SessionsGetResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { Session } from '../../models/session.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSession } from './sessions-mapper.ts';

const handler = toApiResponse<SessionsGetResponse, unknown, SessionsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const query = Session.find();

    if (limit) {
      query.limit(limit);
    }

    const sessions = await query.exec();

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
