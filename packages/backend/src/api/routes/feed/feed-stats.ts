import type {
  FeedStatsQuery,
  FeedStatsResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-stats';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getFeedStats } from '../../../services/feed-stats.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<FeedStatsResponse, unknown, FeedStatsQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const stats = await getFeedStats(request.user._id, request.query);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: stats,
      },
    };
  }
);

export { handler };
