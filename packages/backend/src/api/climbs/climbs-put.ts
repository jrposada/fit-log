import {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@shared/models/climb/climb-put';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
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
      model3d: climbPutData.model3d
        ? new Types.ObjectId(climbPutData.model3d)
        : null,
      image: new Types.ObjectId(climbPutData.image),
      sector: new Types.ObjectId(climbPutData.sector),
      location: new Types.ObjectId(climbPutData.location),
    }
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ model3d?: IModel3D; image: IImage; location: ILocation }>([
      'model3d',
      'image',
      'location',
    ])
    .populate<{
      sector: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>;
    }>({
      path: 'sector',
      populate: ['images', 'models3d'],
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
