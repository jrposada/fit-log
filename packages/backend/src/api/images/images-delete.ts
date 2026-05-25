import type {
  ImagesDeleteParams,
  ImagesDeleteResponse,
} from '@jrposada/fit-log-shared/models/images/images-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Image } from '../../models/image.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<ImagesDeleteResponse, ImagesDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const result = await Image.deleteOne({
      _id: id,
      ...deletableBy(request.user),
    });

    if (result.deletedCount === 0) {
      throw new ResourceNotFound(`Image ${id} not found or not deletable`);
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
