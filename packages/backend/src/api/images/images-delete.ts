import {
  ImagesDeleteParams,
  ImagesDeleteResponse,
} from '@shared/models/image/image-delete';
import { assert } from '@shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Image } from '../../models/image';
import { toApiResponse } from '../api-utils';

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
