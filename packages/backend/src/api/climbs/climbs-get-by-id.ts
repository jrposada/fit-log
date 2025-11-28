import {
  ClimbsGetByIdParams,
  ClimbsGetByIdResponse,
} from '@shared/models/climb';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Climb } from '../../models/climb';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsGetByIdResponse, ClimbsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const climb = await Climb.findById(id);

    if (!climb) {
      throw new ResourceNotFound(`Climb with id ${id} not found`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: toApiClimb(climb),
        },
      },
    };
  }
);

export { handler };
