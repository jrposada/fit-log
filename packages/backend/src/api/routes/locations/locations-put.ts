import type {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertLocation } from '../../../services/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiLocation } from '../../mappers/locations.ts';

const handler = toApiResponse<
  LocationsPutResponse,
  unknown,
  unknown,
  LocationsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const locationPutData = request.body;

  const location = await upsertLocation(request.user, {
    id: locationPutData.id,
    name: locationPutData.name,
    description: locationPutData.description,
    latitude: locationPutData.latitude,
    longitude: locationPutData.longitude,
    googleMapsId: locationPutData.googleMapsId,
    sectors: locationPutData.sectors,
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        location: toApiLocation(location),
      },
    },
  };
});

export { handler };
