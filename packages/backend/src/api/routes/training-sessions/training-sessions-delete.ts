import type {
  TrainingSessionsDeleteParams,
  TrainingSessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteTrainingSession } from '../../../services/training-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  TrainingSessionsDeleteResponse,
  TrainingSessionsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  await deleteTrainingSession(request.user._id, id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
