import type {
  ClimbSearchResult,
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { searchClimbs } from '../../../services/climb.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toApiResponse<ClimbsSearchResponse, unknown, ClimbsSearchQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit, locationId, grade, search } = request.query;

    const { climbs, statusByClimbId } = await searchClimbs({
      limit,
      locationId,
      grade,
      search,
    });

    const results: ClimbSearchResult[] = climbs.map((climb) => ({
      ...toApiClimb(climb),
      userStatus: statusByClimbId.get(climb._id.toString()),
    }));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climbs: results,
        },
      },
    };
  }
);

export { handler };
