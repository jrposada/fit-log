import type {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertSector } from '../../../services/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSector } from '../../mappers/sectors.ts';

const handler = toApiResponse<
  SectorsPutResponse,
  unknown,
  unknown,
  SectorsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sectorPutData = request.body;

  const sector = await upsertSector(request.user, {
    id: sectorPutData.id,
    name: sectorPutData.name,
    description: sectorPutData.description,
    isPrimary: sectorPutData.isPrimary,
    latitude: sectorPutData.latitude,
    longitude: sectorPutData.longitude,
    googleMapsId: sectorPutData.googleMapsId,
    images: sectorPutData.images,
    climbs: sectorPutData.climbs,
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
