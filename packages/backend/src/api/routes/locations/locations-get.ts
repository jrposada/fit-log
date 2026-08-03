import type {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { LocationsCursor } from '../../../services/location.ts';
import { getLocations } from '../../../services/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiLocation } from '../../mappers/locations.ts';

function decodeCursor(raw: string): LocationsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as LocationsCursor;
    if (
      typeof parsed?.createdAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !Types.ObjectId.isValid(parsed.id) ||
      Number.isNaN(Date.parse(parsed.createdAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: LocationsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { cursor, ...filters } = request.query;

    const { locations, nextCursor } = await getLocations(request.user._id, {
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          locations: locations.map(toApiLocation),
          nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
        },
      },
    };
  }
);

export { handler };
