import type {
  Model3dsPostRequest,
  Model3dsPostResponse,
} from '@jrposada/fit-log-shared/models/model-3d/model-3ds-post';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { createModel3d } from '../../../services/model-3d.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiModel3d } from '../../mappers/model-3ds.ts';

const handler = toRequestHandler<
  Model3dsPostResponse,
  unknown,
  unknown,
  Model3dsPostRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const model3d = await createModel3d(request.user, request.body);

  return {
    statusCode: 201,
    body: {
      success: true,
      data: {
        model3d: toApiModel3d(model3d),
      },
    },
  };
});

export { handler };
