import type {
  WorkoutsGetQuery,
  WorkoutsGetResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { Workout } from '../../models/workout.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiWorkout } from './workouts-mapper.ts';

const handler = toApiResponse<WorkoutsGetResponse, unknown, WorkoutsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const query = Workout.find();

    if (limit) {
      query.limit(limit);
    }

    const workouts = await query.exec();

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          workouts: workouts.map(toApiWorkout),
        },
      },
    };
  }
);

export { handler };
