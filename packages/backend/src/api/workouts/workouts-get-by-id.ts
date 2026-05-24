import {
  WorkoutsGetByIdParams,
  WorkoutsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Workout } from '../../models/workout.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiWorkout } from './workouts-mapper.ts';

const handler = toApiResponse<WorkoutsGetByIdResponse, WorkoutsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const workout = await Workout.findById(id);

    if (!workout) {
      throw new ResourceNotFound(`Workout with id ${id} not found`);
    }

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
