import type {
  ClimbsGetQuery,
  ClimbsGetResponse,
} from '@jrposada/fit-log-shared/models/climb/climb-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import type {
  PopulatedOwnership} from '../../auth/ownership-populate.ts';
import {
  OWNERSHIP_POPULATE
} from '../../auth/ownership-populate.ts';
import { Climb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimb } from './climbs-mapper.ts';

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
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
    });

    if (limit) {
      query.limit(limit);
    }

    const climbs = await query
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

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climbs: climbs.map(toApiClimb),
        },
      },
    };
  }
);

export { handler };
