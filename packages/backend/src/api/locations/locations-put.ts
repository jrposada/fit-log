import {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@shared/models/location/location-put';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { ISector } from '../../models/sector';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

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
  ).populate<{
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
