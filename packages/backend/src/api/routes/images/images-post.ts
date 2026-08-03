import type {
  ImagesPostRequest,
  ImagesPostResponse,
} from '@jrposada/fit-log-shared/models/images/images-post';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { createImage } from '../../../services/image.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiImage } from '../../mappers/images.ts';

const handler = toRequestHandler<
  ImagesPostResponse,
  unknown,
  unknown,
  ImagesPostRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const image = await createImage(request.user, request.body);

  return {
    statusCode: 201,
    body: {
      success: true,
      data: {
        image: toApiImage(image),
      },
    },
  };
});

export { handler };
