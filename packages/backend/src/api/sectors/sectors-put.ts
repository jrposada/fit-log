import {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@shared/models/sector/sector-put';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
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
    /* Data */
    name: sectorPutData.name,
    description: sectorPutData.description,
    isPrimary: sectorPutData.isPrimary,
    latitude: sectorPutData.latitude,
    longitude: sectorPutData.longitude,
    googleMapsId: sectorPutData.googleMapsId,

    /* References */
    images: sectorPutData.images.map((imageId) => new Types.ObjectId(imageId)),
    climbs: sectorPutData.climbs.map((climbId) => new Types.ObjectId(climbId)),
  }).populate<{ climbs: IClimb[]; images: IImage[] }>(['images', 'climbs']);

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
