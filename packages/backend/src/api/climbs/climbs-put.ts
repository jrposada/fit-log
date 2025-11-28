import { ClimbsPutRequest, ClimbsPutResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { ObjectId, Types } from 'mongoose';

import { Climb } from '../../models/climb';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<
  ClimbsPutResponse,
  unknown,
  unknown,
  ClimbsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbPutData = request.body;

  const climb = await upsertDocument(Climb, climbPutData.id, {
    name: climbPutData.name,
    grade: climbPutData.grade,
    description: climbPutData.description,
    holds: climbPutData.holds,

    image: new Types.ObjectId(climbPutData.image) as unknown as ObjectId,
    sector: new Types.ObjectId(climbPutData.sector) as unknown as ObjectId,
    location: new Types.ObjectId(climbPutData.location) as unknown as ObjectId,
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
