import type {
  ClimbsGetQuery,
  ClimbsGetResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getClimbs } from '../../../services/climb.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    // TODO: add cursor packages/backend/src/api/routes/climb-histories/climb-histories-get.ts
    const filters = request.query;

    const climbs = await getClimbs(filters);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climbs: climbs.map(toApiClimb),
        },
      },
    };
  }
);

export { handler };
