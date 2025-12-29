import {
  ClimbsGetQuery,
  ClimbsGetResponse,
} from '@shared/models/climb/climb-get';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit, locationId } = request.query;

    const query = Climb.find({
      ...(locationId ? { location: locationId } : {}),
    });

    if (limit) {
      query.limit(limit);
    }

    const climbs = await query
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
