import {
  ClimbHistoriesGetByIdParams,
  ClimbHistoriesGetByIdResponse,
} from '@shared/models/climb-history/climb-history-get-by-id';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { IClimb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';
import { hasValidRefs } from './climb-histories-utils';

const handler = toApiResponse<
  ClimbHistoriesGetByIdResponse,
  ClimbHistoriesGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const climbHistory = await ClimbHistory.findOne({
    _id: id,
    owner: request.user._id,
  })
    .populate<{
      climb: IClimb;
      location: ILocation;
    }>(['climb', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>;
    }>({
      path: 'sector',
      populate: ['images', 'models3d'],
    });

  if (!climbHistory || !hasValidRefs(climbHistory)) {
    throw new ResourceNotFound(`ClimbHistory with id ${id} not found`);
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: toApiClimbHistory(climbHistory),
      },
    },
  };
});

export { handler };
