import type {
  TrainingSessionsDeleteParams,
  TrainingSessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { ownerOrAdminFilter } from '../../auth/owner-or-admin-filter.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<
  TrainingSessionsDeleteResponse,
  TrainingSessionsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const result = await TrainingSession.deleteOne({
    _id: id,
    ...ownerOrAdminFilter(request.user),
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
