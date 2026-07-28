import type {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteLocation } from '../../../services/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<LocationsDeleteResponse, LocationsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteLocation(request.user, id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

export { handler };
