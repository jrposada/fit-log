import type {
  Model3dsDeleteParams,
  Model3dsDeleteResponse,
} from '@jrposada/fit-log-shared/models/model-3d/model-3ds-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteModel3d } from '../../../services/model-3d.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<Model3dsDeleteResponse, Model3dsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteModel3d(request.user, id);

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
