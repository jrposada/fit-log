import {
  LocationsPutRequest,
  locationsPutRequestSchema,
  LocationsPutResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { DbRecord } from '../../../services/aws/db-record';
import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsPutResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { locationPutData } = validateEvent(req);

    const record: DbRecord<'location'> = {
      name: locationPutData.name,
      description: locationPutData.description,
      latitude: locationPutData.latitude,
      longitude: locationPutData.longitude,
      address: locationPutData.address,
      placeName: locationPutData.placeName,
      placeId: locationPutData.placeId,
      lastUsedAt: locationPutData.lastUsedAt,
      createdAt: locationPutData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      PK: 'location',
      SK:
        (locationPutData.id as DbRecord<'location'>['SK']) ??
        LocationsService.instance.newSk(),
    };

    void (await LocationsService.instance.put(record));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          location: {
            id: record.SK,
            name: record.name,
            description: record.description,
            latitude: record.latitude,
            longitude: record.longitude,
            address: record.address,
            placeName: record.placeName,
            placeId: record.placeId,
            lastUsedAt: record.lastUsedAt,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          },
        },
      },
    };
  }
);

function validateEvent(req: Request): {
  locationPutData: LocationsPutRequest;
} {
  if (!req.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = req.body;
    const locationPutData = locationsPutRequestSchema.parse(body);
    return { locationPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
