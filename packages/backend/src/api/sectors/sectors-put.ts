import { SectorsPutRequest, SectorsPutResponse } from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { Sector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

const handler = toApiResponse<
  SectorsPutResponse,
  unknown,
  unknown,
  SectorsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sectorPutData = request.body;

  const sector = new Sector({
    _id: new Types.ObjectId(sectorPutData.id),
    name: sectorPutData.name,
    description: sectorPutData.description,
    isPrimary: sectorPutData.isPrimary,

    latitude: sectorPutData.latitude,
    longitude: sectorPutData.longitude,
    googleMapsId: sectorPutData.googleMapsId,

    images: sectorPutData.images.map((imageId) => new Types.ObjectId(imageId)),
    climbs: sectorPutData.climbs.map((climbId) => new Types.ObjectId(climbId)),

    createdAt: sectorPutData.createdAt
      ? new Date(sectorPutData.createdAt)
      : new Date(),
    updatedAt: new Date(),
  });

  await sector.save();

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sector: toApiSector(sector),
      },
    },
  };
});

export { handler };
