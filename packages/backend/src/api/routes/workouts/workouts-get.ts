import type {
  WorkoutsGetQuery,
  WorkoutsGetResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getWorkouts } from '../../../services/workout.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiWorkout } from '../../mappers/workouts.ts';

const handler = toApiResponse<WorkoutsGetResponse, unknown, WorkoutsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    // TODO: add cursor packages/backend/src/api/routes/climb-histories/climb-histories-get.ts
    const filters = request.query;

    const workouts = await getWorkouts(filters);

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
