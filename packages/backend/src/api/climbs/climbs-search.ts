import {
  ClimbSearchResult,
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@shared/models/climb/climb-search';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import { Climb } from '../../models/climb';
import { ClimbHistory, ClimbHistoryStatus } from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsSearchResponse, unknown, ClimbsSearchQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit, locationId, grade, search } = request.query;

    const query = Climb.find({
      ...(locationId ? { location: locationId } : {}),
      ...(grade && grade.length > 0 ? { grade: { $in: grade } } : {}),
      ...(search && search.trim()
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { grade: { $regex: search, $options: 'i' } },
            ],
          }
        : {}),
    })
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

    if (limit) {
      query.limit(limit);
    }

    const climbs = await query;
    const climbIds = climbs.map((c) => c._id);

    const histories = await ClimbHistory.find({
      climb: { $in: climbIds },
    }).sort({ createdAt: -1 });

    // Build a map of climb ID to best status (send/flash > attempt > project)
    const statusMap = new Map<
      string,
      { status: ClimbHistoryStatus; attempts?: number }
    >();

    const statusPriority: Record<ClimbHistoryStatus, number> = {
      flash: 4,
      send: 3,
      attempt: 2,
      project: 1,
    };

    for (const history of histories) {
      const climbId = history.climb.toString();
      const existing = statusMap.get(climbId);

      if (
        !existing ||
        statusPriority[history.status] > statusPriority[existing.status]
      ) {
        statusMap.set(climbId, {
          status: history.status,
          attempts: history.attempts,
        });
      }
    }

    // Combine climbs with their user status
    const results: ClimbSearchResult[] = climbs.map((climb) => {
      const baseClimb = toApiClimb(climb);
      const userStatus = statusMap.get(climb._id.toString());

      return {
        ...baseClimb,
        userStatus,
      };
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climbs: results,
        },
      },
    };
  }
);

export { handler };
