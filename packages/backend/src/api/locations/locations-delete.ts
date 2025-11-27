import { assert } from '@shared/utils/assert';
import { LocationsService } from '../../services/locations-service';
import { toApiResponse } from '../api-utils';
import {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@shared/models/location';

const handler = toApiResponse<LocationsDeleteResponse, LocationsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    void (await LocationsService.instance.delete(id));

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
