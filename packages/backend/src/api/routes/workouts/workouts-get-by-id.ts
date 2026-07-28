import type {
  WorkoutsGetByIdParams,
  WorkoutsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getWorkoutById } from '../../../services/workout.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiWorkout } from '../../mappers/workouts.ts';

const handler = toApiResponse<WorkoutsGetByIdResponse, WorkoutsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const workout = await getWorkoutById(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          workout: toApiWorkout(workout),
        },
      },
    };
  }
);

export { handler };
