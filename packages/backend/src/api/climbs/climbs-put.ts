import {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@shared/models/climb/climb-put';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document';
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

  const climb = await upsertOwnedDocument(
    Climb,
    climbPutData.id,
    request.user,
    {
      /* Data */
      name: climbPutData.name,
      grade: climbPutData.grade,
      description: climbPutData.description,
      holds: climbPutData.holds,
      spline: climbPutData.spline,

      /* References */
      image: new Types.ObjectId(climbPutData.image),
      sector: new Types.ObjectId(climbPutData.sector),
      location: new Types.ObjectId(climbPutData.location),
    }
  )
    .populate<{
      image: IImage;
      location: ILocation;
    }>(['image', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(
      `Climb ${climbPutData.id ?? ''} not found or not editable`
    );
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
});

export { handler };
