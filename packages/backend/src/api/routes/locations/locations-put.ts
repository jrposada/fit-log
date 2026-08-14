import type {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertLocation } from '../../../services/location.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import {
  toApiLocation,
  toUpsertLocationInput,
} from '../../mappers/locations.ts';

const handler = toRequestHandler<
  LocationsPutResponse,
  unknown,
  unknown,
  LocationsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const location = await upsertLocation(
    request.user,
    toUpsertLocationInput(request.body)
  );

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
