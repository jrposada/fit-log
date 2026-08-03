import type {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getLocationById } from '../../../services/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiLocation } from '../../mappers/locations.ts';

const handler = toApiResponse<LocationsGetByIdResponse, LocationsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const location = await getLocationById(request.user._id, id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          location: toApiLocation(location),
        },
      },
    };
  }
);

export { handler };
