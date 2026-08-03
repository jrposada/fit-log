import type {
  ClimbSearchResult,
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { searchClimbs } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toRequestHandler<
  ClimbsSearchResponse,
  unknown,
  ClimbsSearchQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { climbs, statusByClimbId } = await searchClimbs(request.query);

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
});

export { handler };
