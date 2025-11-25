import {
  Location,
  LocationsGetParams,
  locationsGetParamsSchema,
  LocationsGetResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsGetResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(event);

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

function validateEvent(event: APIGatewayProxyEvent): {
  params: LocationsGetParams;
} {
  try {
    const params = locationsGetParamsSchema.parse(
      event.queryStringParameters ?? {}
    );
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
