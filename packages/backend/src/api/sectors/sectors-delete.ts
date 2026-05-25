import type {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Sector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<SectorsDeleteResponse, SectorsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const result = await Sector.deleteOne({
      _id: id,
      ...deletableBy(request.user),
    });

    if (result.deletedCount === 0) {
      throw new ResourceNotFound(`Sector ${id} not found or not deletable`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

export { handler };
