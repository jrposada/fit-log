import type {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteClimb } from '../../../services/climb.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<ClimbsDeleteResponse, ClimbsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteClimb(request.user, id);

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
