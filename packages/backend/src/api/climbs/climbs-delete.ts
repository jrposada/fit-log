import { ClimbsDeleteParams, ClimbsDeleteResponse } from '@shared/models/climb';

import { Climb } from '../../models/climb';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<ClimbsDeleteResponse, ClimbsDeleteParams>(
  async (request) => {
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
