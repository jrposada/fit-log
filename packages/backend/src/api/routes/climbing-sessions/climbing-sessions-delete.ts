import type {
  ClimbingSessionsDeleteParams,
  ClimbingSessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteClimbingSession } from '../../../services/climbing-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  ClimbingSessionsDeleteResponse,
  ClimbingSessionsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  await deleteClimbingSession(request.user._id, id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
