import {
  ClimbSearchResult,
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@shared/models/climb/climb-search';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import { Climb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
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
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{ model3d: IModel3D; image: IImage; location: ILocation }>([
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
