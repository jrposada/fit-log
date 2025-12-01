import {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { Sector } from '../../models/sector';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

const handler = toApiResponse<
  SectorsBatchPutResponse,
  never,
  never,
  SectorsBatchPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { sectors: sectorsData } = request.body;

  const savedSectors = await Promise.all(
    sectorsData.map(async (sectorPutData) => {
      const sector = await upsertDocument(Sector, sectorPutData.id, {
        name: sectorPutData.name,
        description: sectorPutData.description,
        isPrimary: sectorPutData.isPrimary,

        latitude: sectorPutData.latitude,
        longitude: sectorPutData.longitude,
        googleMapsId: sectorPutData.googleMapsId,

        images: sectorPutData.images.map(
          (imageId: string) => new Types.ObjectId(imageId)
        ),
        climbs: sectorPutData.climbs.map(
          (climbId: string) => new Types.ObjectId(climbId)
        ),
      });

      return toApiSector(sector);
    })
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sectors: savedSectors,
      },
    },
  };
});

export { handler };
