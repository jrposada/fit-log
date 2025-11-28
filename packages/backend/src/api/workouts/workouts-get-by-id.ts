import {
  WorkoutsGetByIdParams,
  WorkoutsGetByIdResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Workout } from '../../models/workout';
import { toApiResponse } from '../api-utils';
import { toApiWorkout } from './workouts-mapper';

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
