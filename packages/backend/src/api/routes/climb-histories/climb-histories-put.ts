import type {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimbHistoryTry } from '../../../services/climb-history.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import {
  toApiClimbHistory,
  toUpsertClimbHistoryTryInput,
} from '../../mappers/climb-histories.ts';

const handler = toRequestHandler<
  ClimbHistoriesPutResponse,
  unknown,
  unknown,
  ClimbHistoriesPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbHistory = await upsertClimbHistoryTry(
    request.user._id,
    toUpsertClimbHistoryTryInput(request.body)
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: toApiClimbHistory(climbHistory),
      },
    },
  };
});

export { handler };
