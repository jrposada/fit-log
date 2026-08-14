import type {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-batch-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { batchUpsertSectors } from '../../../services/sector.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiSector, toUpsertSectorInput } from '../../mappers/sectors.ts';

const handler = toRequestHandler<
  SectorsBatchPutResponse,
  never,
  never,
  SectorsBatchPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { sectors: sectorsData } = request.body;

  const sectors = await batchUpsertSectors(
    request.user,
    sectorsData.map(toUpsertSectorInput)
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
