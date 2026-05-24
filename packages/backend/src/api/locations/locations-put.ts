import {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@jrposada/fit-log-shared/models/location/location-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { IImage } from '../../models/image.ts';
import { Location } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiLocation } from './locations-mapper.ts';

const handler = toApiResponse<
  LocationsPutResponse,
  unknown,
  unknown,
  LocationsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const locationPutData = request.body;

  const location = await upsertOwnedDocument(
    Location,
    locationPutData.id,
    request.user,
    {
      /* Data */
      name: locationPutData.name,
      description: locationPutData.description,
      latitude: locationPutData.latitude,
      longitude: locationPutData.longitude,
      googleMapsId: locationPutData.googleMapsId,

      /* References */
      sectors: locationPutData.sectors.map(
        (sectorId) => new Types.ObjectId(sectorId)
      ),
    }
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: MergeType<ISector, { images: IImage[] }>[];
    }>({
      path: 'sectors',
      populate: ['images'],
    });

  if (!location) {
    throw new ResourceNotFound(
      `Location ${locationPutData.id ?? ''} not found or not editable`
    );
  }

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
