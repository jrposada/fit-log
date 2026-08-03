import type {
  ClimbsGetByIdParams,
  ClimbsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getClimbById } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toRequestHandler<ClimbsGetByIdResponse, ClimbsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const climb = await getClimbById(id);

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
