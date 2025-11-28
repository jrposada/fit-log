import { SectorsPutRequest, SectorsPutResponse } from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { ObjectId, Types } from 'mongoose';

import { Sector } from '../../models/sector';
import { upsertDocument } from '../../utils/upsert-document';
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

  const sector = await upsertDocument(Sector, sectorPutData.id, {
    name: sectorPutData.name,
    description: sectorPutData.description,
    isPrimary: sectorPutData.isPrimary,

    latitude: sectorPutData.latitude,
    longitude: sectorPutData.longitude,
    googleMapsId: sectorPutData.googleMapsId,

    images: sectorPutData.images.map(
      (imageId) => new Types.ObjectId(imageId)
    ) as unknown as ObjectId[],
    climbs: sectorPutData.climbs.map(
      (climbId) => new Types.ObjectId(climbId)
    ) as unknown as ObjectId[],
  });

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
