import type {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteClimb } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<ClimbsDeleteResponse, ClimbsDeleteParams>(
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
