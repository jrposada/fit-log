import {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@shared/models/climb/climb-put';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
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
    /* Data */
    name: climbPutData.name,
    grade: climbPutData.grade,
    description: climbPutData.description,
    holds: climbPutData.holds,

    /* References */
    image: new Types.ObjectId(climbPutData.image),
    sector: new Types.ObjectId(climbPutData.sector),
    location: new Types.ObjectId(climbPutData.location),
  }).populate<{
    image: IImage;
    location: ILocation;
    sector: ISector;
  }>(['image', 'location', 'sector']);

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
