import type {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-batch-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { batchDeleteSectors } from '../../../services/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<
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
