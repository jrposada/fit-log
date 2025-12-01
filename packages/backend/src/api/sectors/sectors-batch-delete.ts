import {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';

import { Sector } from '../../models/sector';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  SectorsBatchDeleteResponse,
  never,
  never,
  SectorsBatchDeleteRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { ids } = request.body;

  const result = await Sector.deleteMany({ _id: { $in: ids } });

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
