import {
  LocationsPutRequest,
  locationsPutRequestSchema,
  LocationsPutResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { DbRecord } from '../../../services/aws/db-record';
import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsPutResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { locationPutData } = validateEvent(event);

    const record: DbRecord<'location'> = {
      name: locationPutData.name,
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
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          },
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  locationPutData: LocationsPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const locationPutData = locationsPutRequestSchema.parse(body);
    return { locationPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
