import type {
  ClimbHistoriesGetByIdParams,
  ClimbHistoriesGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climb-history/climb-history-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimb } from '../../models/climb.ts';
import { ClimbHistory } from '../../models/climb-history.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimbHistory } from './climb-histories-mapper.ts';
import { hasValidRefs } from './climb-histories-utils.ts';

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
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
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
