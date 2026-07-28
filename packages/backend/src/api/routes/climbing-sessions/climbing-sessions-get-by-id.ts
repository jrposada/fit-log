import type {
  ClimbingSessionsGetByIdParams,
  ClimbingSessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { Types } from 'mongoose';

import { getClimbingSessionById } from '../../../services/climbing-session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

const handler = toApiResponse<
  ClimbingSessionsGetByIdResponse,
  ClimbingSessionsGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const session = await getClimbingSessionById(
    request.user._id as Types.ObjectId,
    id
  );

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
