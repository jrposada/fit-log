import { Climb, ClimbsGetQuery, ClimbsGetResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';

import { ClimbsService } from '../../services/climbs-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const query = request.query;

    const { items: climbs, lastEvaluatedKey } =
      await ClimbsService.instance.getAll(
        ClimbsService.instance.calculatePartialSk(),
        query.limit
      );

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          lastEvaluatedKey,
          climbs: climbs.map<Climb>((item) => ({
            id: item.SK,
            location: item.location,
            holds: item.holds.map((hold) => ({
              x: hold.x,
              y: hold.y,
            })),
            name: item.name,
            grade: item.grade,
            description: item.description,
            sector: item.sector,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      },
    };
  }
);

export { handler };
