import type {
  ClimbingSessionsPutRequest,
  ClimbingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimbingSession } from '../../../services/climbing-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

const handler = toRequestHandler<
  ClimbingSessionsPutResponse,
  unknown,
  unknown,
  ClimbingSessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const session = await upsertClimbingSession(request.user, request.body);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbingSession: toApiClimbingSession(session),
      },
    },
  };
});

export { handler };
