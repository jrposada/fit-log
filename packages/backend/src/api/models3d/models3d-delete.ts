import {
  Models3dDeleteParams,
  Models3dDeleteResponse,
} from '@shared/models/model3d/model3d-delete';
import { assert } from '@shared/utils/assert';

import { deletableBy } from '../../auth/deletable-filter';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Model3D } from '../../models/model3d';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<Models3dDeleteResponse, Models3dDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const result = await Model3D.deleteOne({
      _id: id,
      ...deletableBy(request.user),
    });

    if (result.deletedCount === 0) {
      throw new ResourceNotFound(`Model3D ${id} not found or not deletable`);
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
