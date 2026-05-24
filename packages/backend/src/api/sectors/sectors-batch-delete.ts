import {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@shared/models/sector/sector-batch-delete';
import { assert } from '@shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter.ts';
import { Sector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<
  SectorsBatchDeleteResponse,
  never,
  never,
  SectorsBatchDeleteRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { ids } = request.body;

  const result = await Sector.deleteMany({
    _id: { $in: ids },
    ...deletableBy(request.user),
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        deletedCount: result.deletedCount || 0,
      },
    },
  };
});

export { handler };
