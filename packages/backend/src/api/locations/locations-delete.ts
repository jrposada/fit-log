import {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';

import { Location } from '../../models/location';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<LocationsDeleteResponse, LocationsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await Location.deleteOne({ _id: id });

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
