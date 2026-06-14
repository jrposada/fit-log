import type {
  ClimbingSessionsDeleteParams,
  ClimbingSessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { ClimbingSession } from '../../models/climbing-session.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<
  ClimbingSessionsDeleteResponse,
  ClimbingSessionsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const result = await ClimbingSession.deleteOne({
    _id: id,
    owner: request.user._id,
  });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(
      `Training session ${id} not found or not deletable`
    );
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
