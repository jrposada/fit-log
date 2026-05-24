import {
  WorkoutsPutRequest,
  WorkoutsPutResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { Workout } from '../../models/workout.ts';
import { upsertDocument } from '../../utils/upsert-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiWorkout } from './workouts-mapper.ts';

const handler = toApiResponse<
  WorkoutsPutResponse,
  unknown,
  unknown,
  WorkoutsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const workoutPutData = request.body;

  const workout = await upsertDocument(Workout, workoutPutData.id, {
    name: workoutPutData.name,
    description: workoutPutData.description,
    exercises: workoutPutData.exercises,
  });

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
