import { LocationsGetByIdResponse } from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsGetByIdResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);

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

function validateEvent(event: APIGatewayProxyEvent): {
  id: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { id: event.pathParameters.id };
}
