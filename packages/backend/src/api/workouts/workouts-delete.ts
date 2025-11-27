import { assert } from '@shared/utils/assert';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';
import {
  WorkoutsDeleteParams,
  WorkoutsDeleteResponse,
} from '@shared/models/workout';


const handler = toApiResponse<WorkoutsDeleteResponse, WorkoutsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;
    const { userId } = request.user;

    assert(WorkoutsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await WorkoutsService.instance.delete(id));

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
