import {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@shared/models/location/location-put';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { ISector } from '../../models/sector';
import { upsertDocument } from '../../utils/upsert-document';
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

  const location = await upsertDocument(Location, locationPutData.id, {
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
  }).populate<{
    sectors: MergeType<ISector, { images: IImage[] }>[];
  }>({
    path: 'sectors',
    populate: ['images'],
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
