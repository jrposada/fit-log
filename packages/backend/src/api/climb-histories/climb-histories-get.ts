import {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@shared/models/climb-history/climb-history-get';
import { assert } from '@shared/utils/assert';

import { IClimb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';

const handler = toApiResponse<
  ClimbHistoriesGetResponse,
  unknown,
  ClimbHistoriesGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { limit, climbId, locationId, sectorId, status, startDate, endDate } =
    request.query;

  const query = ClimbHistory.find({
    ...(climbId ? { climb: climbId } : {}),
    ...(locationId ? { location: locationId } : {}),
    ...(sectorId ? { sector: sectorId } : {}),
    ...(status ? { status } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  });

  if (limit) {
    query.limit(limit);
  }

  query.sort({ createdAt: -1 });

  const climbHistories = await query.populate<{
    climb: IClimb;
    location: ILocation;
    sector: ISector;
  }>(['climb', 'location', 'sector']);

  console.log(climbHistories);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistories: climbHistories.map(toApiClimbHistory),
      },
    },
  };
});

export { handler };
