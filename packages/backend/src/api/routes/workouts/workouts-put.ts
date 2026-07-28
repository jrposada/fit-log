import type {
  WorkoutsPutRequest,
  WorkoutsPutResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertWorkout } from '../../../services/workout.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiWorkout } from '../../mappers/workouts.ts';

const handler = toApiResponse<
  WorkoutsPutResponse,
  unknown,
  unknown,
  WorkoutsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const workout = await upsertWorkout(request.body);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        workout: toApiWorkout(workout),
      },
    },
  };
});

export { handler };
