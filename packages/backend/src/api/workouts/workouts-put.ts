import {
  WorkoutsPutRequest,
  WorkoutsPutResponse,
} from '@shared/models/workout/workout-put';
import { assert } from '@shared/utils/assert';

import { Workout } from '../../models/workout';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiWorkout } from './workouts-mapper';

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
