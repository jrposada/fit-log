import {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@shared/models/climb/climb-delete';
import { assert } from '@shared/utils/assert';

import { Climb } from '../../models/climb';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<ClimbsDeleteResponse, ClimbsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await Climb.deleteOne({ _id: id });

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
