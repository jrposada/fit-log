import type {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteSector } from '../../../services/sector.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<SectorsDeleteResponse, SectorsDeleteParams>(
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
