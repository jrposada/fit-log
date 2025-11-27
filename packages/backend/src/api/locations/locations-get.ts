import {
  Location,
  LocationsGetQuery,
  LocationsGetResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { LocationsService } from '../../services/locations-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const params = request.query;

    const { items: locations, lastEvaluatedKey } =
      await LocationsService.instance.getAll(
        LocationsService.instance.calculatePartialSk(),
        params.limit
      );

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          lastEvaluatedKey,
          locations: locations.map<Location>((item) => ({
            id: item.SK,
            name: item.name,
            description: item.description,
            latitude: item.latitude,
            longitude: item.longitude,
            address: item.address,
            placeName: item.placeName,
            placeId: item.placeId,
            lastUsedAt: item.lastUsedAt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      },
    };
  }
);

export { handler };
