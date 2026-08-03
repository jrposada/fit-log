import type {
  TrainingSessionsGetByIdParams,
  TrainingSessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getTrainingSessionById } from '../../../services/training-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiTrainingSession } from '../../mappers/training-sessions.ts';

const handler = toRequestHandler<
  TrainingSessionsGetByIdResponse,
  TrainingSessionsGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const session = await getTrainingSessionById(request.user._id, id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingSession: toApiTrainingSession(session),
      },
    },
  };
});

export { handler };
