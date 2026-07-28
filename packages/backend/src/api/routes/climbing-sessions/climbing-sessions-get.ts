import type {
  ClimbingSessionsGetQuery,
  ClimbingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getClimbingSessions } from '../../../services/climbing-session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

const handler = toApiResponse<
  ClimbingSessionsGetResponse,
  unknown,
  ClimbingSessionsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { limit, active } = request.query;

  const sessions = await getClimbingSessions(request.user._id, {
    limit,
    active,
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbingSessions: sessions.map(toApiClimbingSession),
      },
    },
  };
});

export { handler };
