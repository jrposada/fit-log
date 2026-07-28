import type {
  ImagesDeleteParams,
  ImagesDeleteResponse,
} from '@jrposada/fit-log-shared/models/images/images-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteImage } from '../../../services/image.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<ImagesDeleteResponse, ImagesDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteImage(request.user, id);

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
