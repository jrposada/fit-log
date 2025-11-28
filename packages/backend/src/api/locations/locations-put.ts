import {
  LocationsPutRequest,
  LocationsPutResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { Location } from '../../models/location';
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

  const location = new Location({
    _id: new Types.ObjectId(locationPutData.id),
    name: locationPutData.name,
    description: locationPutData.description,

    latitude: locationPutData.latitude,
    longitude: locationPutData.longitude,
    googleMapsId: locationPutData.googleMapsId,

    sectors: locationPutData.sectors.map(
      (sectorId) => new Types.ObjectId(sectorId)
    ),

    createdAt: locationPutData.createdAt
      ? new Date(locationPutData.createdAt)
      : new Date(),
    updatedAt: new Date(),
  });

  await location.save();

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
