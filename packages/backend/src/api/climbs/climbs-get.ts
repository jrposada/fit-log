import { ClimbsGetQuery, ClimbsGetResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';

import { Climb } from '../../models/climb';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit, locationId } = request.query;

    const query = Climb.find({
      ...(locationId ? { location: locationId } : {}),
    });

    if (limit) {
      query.limit(limit);
    }

    const climbs = await query.exec();

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
