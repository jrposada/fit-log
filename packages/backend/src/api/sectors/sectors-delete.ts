import {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@shared/models/sector/sector-delete';
import { assert } from '@shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Sector } from '../../models/sector';
import { toApiResponse } from '../api-utils';

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
