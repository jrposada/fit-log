import type {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@jrposada/fit-log-shared/models/location/location-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Location } from '../../models/location.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<LocationsDeleteResponse, LocationsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const result = await Location.deleteOne({
      _id: id,
      ...deletableBy(request.user),
    });

    if (result.deletedCount === 0) {
      throw new ResourceNotFound(`Location ${id} not found or not deletable`);
    }

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
