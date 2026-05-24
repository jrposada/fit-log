import type {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@jrposada/fit-log-shared/models/climb/climb-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType} from 'mongoose';
import { Types } from 'mongoose';

import type {
  PopulatedOwnership} from '../../auth/ownership-populate.ts';
import {
  OWNERSHIP_POPULATE
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Climb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimb } from './climbs-mapper.ts';

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
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
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
