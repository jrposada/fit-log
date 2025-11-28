import { SessionsGetQuery, SessionsGetResponse } from '@shared/models/session';
import { assert } from '@shared/utils/assert';

import { Session } from '../../models/session';
import { toApiResponse } from '../api-utils';
import { toApiSession } from './sessions-mapper';

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
