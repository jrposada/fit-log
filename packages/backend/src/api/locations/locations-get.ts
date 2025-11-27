import {
  Location,
  LocationsGetParams,
  locationsGetParamsSchema,
  LocationsGetResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { LocationsService } from '../../services/locations-service';
import { apiHandler } from '../api-utils';

export const handler = apiHandler<LocationsGetResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(req);

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

function validateEvent(req: Request): {
  params: LocationsGetParams;
} {
  try {
    const params = locationsGetParamsSchema.parse(
      req.query ?? {}
    );
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
