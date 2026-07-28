import type {
  ClimbingSessionsPutRequest,
  ClimbingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimbingSession } from '../../../services/climbing-session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

const handler = toApiResponse<
  ClimbingSessionsPutResponse,
  unknown,
  unknown,
  ClimbingSessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const body = request.body;

  const session = await upsertClimbingSession(request.user, {
    id: body.id,
    title: body.title,
    notes: body.notes,
    location: body.location,
  });

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
