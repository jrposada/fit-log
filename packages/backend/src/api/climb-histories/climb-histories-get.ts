import {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@shared/models/climb-history/climb-history-get';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { IImage } from '../../models/image';
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

  // Split 'project' out of status array into an isProject filter
  const includeProjects = status?.includes('project') ?? false;
  const dbStatuses = status?.filter((s) => s !== 'project');

  const baseFilter: Record<string, unknown> = {
    ...(climbId ? { climb: climbId } : {}),
    ...(locationId ? { location: locationId } : {}),
    ...(sectorId ? { sector: sectorId } : {}),
    ...(startDate || endDate
      ? {
          updatedAt: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  if (dbStatuses?.length && includeProjects) {
    baseFilter.$or = [
      { status: { $in: dbStatuses } },
      { isProject: true, status: { $nin: ['send', 'flash'] } },
    ];
  } else if (dbStatuses?.length) {
    baseFilter.status = { $in: dbStatuses };
  } else if (includeProjects) {
    baseFilter.isProject = true;
  }

  const query = ClimbHistory.find(baseFilter);

  if (limit) {
    query.limit(limit);
  }

  query.sort({ updatedAt: -1 });

  const climbHistories = await query
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
