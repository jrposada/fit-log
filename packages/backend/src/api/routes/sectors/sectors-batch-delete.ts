import type {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-batch-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { batchDeleteSectors } from '../../../services/sector.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  SectorsBatchDeleteResponse,
  never,
  never,
  SectorsBatchDeleteRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { ids } = request.body;

  const deletedCount = await batchDeleteSectors(request.user, ids);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        deletedCount,
      },
    },
  };
});

export { handler };
