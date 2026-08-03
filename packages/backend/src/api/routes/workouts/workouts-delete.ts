import type {
  WorkoutsDeleteParams,
  WorkoutsDeleteResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteWorkout } from '../../../services/workout.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<WorkoutsDeleteResponse, WorkoutsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteWorkout(id);

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
