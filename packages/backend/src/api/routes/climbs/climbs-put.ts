import type {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimb } from '../../../services/climb.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toApiResponse<
  ClimbsPutResponse,
  unknown,
  unknown,
  ClimbsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbPutData = request.body;

  const climb = await upsertClimb(request.user, {
    id: climbPutData.id,
    name: climbPutData.name,
    grade: climbPutData.grade,
    description: climbPutData.description,
    holds: climbPutData.holds,
    spline: climbPutData.spline,
    image: climbPutData.image,
    sector: climbPutData.sector,
    location: climbPutData.location,
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climb: toApiClimb(climb),
      },
    },
  };
});

export { handler };
