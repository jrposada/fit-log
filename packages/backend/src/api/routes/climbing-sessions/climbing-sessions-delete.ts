import type {
  ClimbingSessionsDeleteParams,
  ClimbingSessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { Types } from 'mongoose';

import { deleteClimbingSession } from '../../../services/climbing-session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<
  ClimbingSessionsDeleteResponse,
  ClimbingSessionsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  await deleteClimbingSession(request.user._id as Types.ObjectId, id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
