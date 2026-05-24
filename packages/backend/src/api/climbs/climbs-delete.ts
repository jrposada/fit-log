import type {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climb/climb-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Climb } from '../../models/climb.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<ClimbsDeleteResponse, ClimbsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const result = await Climb.deleteOne({
      _id: id,
      ...deletableBy(request.user),
    });

    if (result.deletedCount === 0) {
      throw new ResourceNotFound(`Climb ${id} not found or not deletable`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

export { handler };
