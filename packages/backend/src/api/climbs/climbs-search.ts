import type {
  ClimbSearchResult,
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@jrposada/fit-log-shared/models/climb/climb-search';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import { Climb } from '../../models/climb.ts';
import { ClimbHistory } from '../../models/climb-history.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimb } from './climbs-mapper.ts';

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

    if (limit) {
      query.limit(limit);
    }

    const climbs = await query;
    const climbIds = climbs.map((c) => c._id);

    const histories = await ClimbHistory.find({
      climb: { $in: climbIds },
    });

    const statusMap = new Map(
      histories.flatMap((h) => {
        if (h.climb == null) return [];

        const totalAttempts = h.tries.reduce(
          (sum, t) => sum + (t.attempts ?? 0),
          0
        );
        const lastTry = h.tries[h.tries.length - 1];

        return [
          [
            h.climb.toString(),
            {
              status: h.status,
              isProject: h.isProject,
              attempts: totalAttempts || undefined,
              lastTriedDate: lastTry?.date
                ? lastTry.date.toISOString()
                : undefined,
            },
          ] as const,
        ];
      })
    );

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
