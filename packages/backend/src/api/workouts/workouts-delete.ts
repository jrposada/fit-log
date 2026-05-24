import {
  WorkoutsDeleteParams,
  WorkoutsDeleteResponse,
} from '@shared/models/workout/workout-delete';
import { assert } from '@shared/utils/assert';

import { Workout } from '../../models/workout.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<WorkoutsDeleteResponse, WorkoutsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await Workout.deleteOne({ _id: id });

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
