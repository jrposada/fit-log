import type {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimbHistoryTry } from '../../../services/climb-history.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbHistory } from '../../mappers/climb-histories.ts';

const handler = toApiResponse<
  ClimbHistoriesPutResponse,
  unknown,
  unknown,
  ClimbHistoriesPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbHistory = await upsertClimbHistoryTry(
    request.user._id,
    request.body
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
