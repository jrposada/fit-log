import { LocationsGetByIdResponse } from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsGetByIdResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(req);

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

function validateEvent(req: Request): {
  id: string;
} {
  if (!req.params?.id) {
    throw new Error('Invalid request');
  }

  return { id: req.params.id };
}
