import {
  ClimbsGetByIdParams,
  ClimbsGetByIdResponse,
} from '@shared/models/climb';
import { assert } from '@shared/utils/assert';

import { ClimbsService } from '../../services/climbs-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<ClimbsGetByIdResponse, ClimbsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const climb = await ClimbsService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: {
            id: climb.SK,
            location: climb.location,
            holds: climb.holds.map((hold) => ({
              x: hold.x,
              y: hold.y,
            })),
            name: climb.name,
            grade: climb.grade,
            description: climb.description,
            sector: climb.sector,
            createdAt: climb.createdAt,
            updatedAt: climb.updatedAt,
          },
        },
      },
    };
  }
);

export { handler };
