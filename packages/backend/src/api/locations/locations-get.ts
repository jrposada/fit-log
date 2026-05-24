import {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@jrposada/fit-log-shared/models/location/location-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import { IImage } from '../../models/image.ts';
import { Location } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiLocation } from './locations-mapper.ts';

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const query = Location.find()
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        sectors: MergeType<ISector, { images: IImage[] }>[];
      }>({
        path: 'sectors',
        populate: ['images'],
      });

    if (limit) {
      query.limit(limit);
    }

    const locations = await query.exec();

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          locations: locations.map(toApiLocation),
        },
      },
    };
  }
);

export { handler };
