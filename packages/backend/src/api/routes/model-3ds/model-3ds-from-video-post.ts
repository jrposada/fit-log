import type {
  Model3dsFromVideoPostRequest,
  Model3dsFromVideoPostResponse,
} from '@jrposada/fit-log-shared/models/model-3d/model-3ds-from-video-post';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { createModel3dFromVideo } from '../../../services/model-3d.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiModel3d } from '../../mappers/model-3ds.ts';

const handler = toRequestHandler<
  Model3dsFromVideoPostResponse,
  unknown,
  unknown,
  Model3dsFromVideoPostRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const model3d = await createModel3dFromVideo(request.user, request.body);

  return {
    statusCode: 202,
    body: {
      success: true,
      data: {
        model3d: toApiModel3d(model3d),
      },
    },
  };
});

export { handler };
