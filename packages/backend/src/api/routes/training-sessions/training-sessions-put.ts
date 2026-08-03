import type {
  TrainingSessionsPutRequest,
  TrainingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertTrainingSession } from '../../../services/training-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiTrainingSession } from '../../mappers/training-sessions.ts';

const handler = toRequestHandler<
  TrainingSessionsPutResponse,
  unknown,
  unknown,
  TrainingSessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const session = await upsertTrainingSession(request.user, request.body);

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
