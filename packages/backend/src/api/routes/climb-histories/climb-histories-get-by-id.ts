import type {
  ClimbHistoriesGetByIdParams,
  ClimbHistoriesGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getClimbHistoryById } from '../../../services/climb-history.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimbHistory } from '../../mappers/climb-histories.ts';

const handler = toRequestHandler<
  ClimbHistoriesGetByIdResponse,
  ClimbHistoriesGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const climbHistory = await getClimbHistoryById(request.user._id, id);

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
