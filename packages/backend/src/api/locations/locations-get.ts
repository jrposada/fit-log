import type {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import type { IImage } from '../../models/image.ts';
import { Location } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
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
