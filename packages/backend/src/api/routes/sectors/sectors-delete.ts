import type {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteSector } from '../../../services/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<SectorsDeleteResponse, SectorsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteSector(request.user, id);

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
