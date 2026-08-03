import type {
  ClimbHistoriesStatsQuery,
  ClimbHistoriesStatsResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-stats';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getClimbHistoriesStats } from '../../../services/climb-history.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  ClimbHistoriesStatsResponse,
  unknown,
  ClimbHistoriesStatsQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const stats = await getClimbHistoriesStats(request.user._id, request.query);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: stats,
    },
  };
});

export { handler };
