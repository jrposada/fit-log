import {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';

import { Location } from '../../models/location';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const query = Location.find();

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
