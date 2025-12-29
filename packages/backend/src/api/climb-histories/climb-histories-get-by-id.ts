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
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';

const handler = toApiResponse<
  ClimbHistoriesGetByIdResponse,
  ClimbHistoriesGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const climbHistory = await ClimbHistory.findById(id)
    .populate<{
      climb: IClimb;
      location: ILocation;
    }>(['climb', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climbHistory) {
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
