import { assert } from '@shared/utils/assert';
import { LocationsService } from '../../services/locations-service';
import { toApiResponse } from '../api-utils';
import {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@shared/models/location';

const handler = toApiResponse<LocationsGetByIdResponse, LocationsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const location = await LocationsService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          location: {
            id: location.SK,
            name: location.name,
            description: location.description,
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
            placeName: location.placeName,
            placeId: location.placeId,
            lastUsedAt: location.lastUsedAt,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt,
          },
        },
      },
    };
  }
);

export { handler };
