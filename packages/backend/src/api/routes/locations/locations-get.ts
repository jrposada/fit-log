import type {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getLocations } from '../../../services/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiLocation } from '../../mappers/locations.ts';

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    // TODO: add cursor packages/backend/src/api/routes/climb-histories/climb-histories-get.ts
    const filters = request.query;

    const locations = await getLocations(filters);

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
