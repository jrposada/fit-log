import type {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-batch-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { batchUpsertSectors } from '../../../services/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSector } from '../../mappers/sectors.ts';

const handler = toApiResponse<
  SectorsBatchPutResponse,
  never,
  never,
  SectorsBatchPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { sectors: sectorsData } = request.body;

  const sectors = await batchUpsertSectors(
    request.user,
    sectorsData.map((sectorPutData) => ({
      id: sectorPutData.id,
      name: sectorPutData.name,
      description: sectorPutData.description,
      isPrimary: sectorPutData.isPrimary,
      latitude: sectorPutData.latitude,
      longitude: sectorPutData.longitude,
      googleMapsId: sectorPutData.googleMapsId,
      images: sectorPutData.images,
      climbs: sectorPutData.climbs,
    }))
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sectors: sectors.map(toApiSector),
      },
    },
  };
});

export { handler };
