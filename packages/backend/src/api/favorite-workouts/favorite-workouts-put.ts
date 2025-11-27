import {
  FavoriteWorkoutsPutRequest,
  FavoriteWorkoutsPutResponse,
} from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';

import { DbRecord } from '../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../services/favorite-workouts-service';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  FavoriteWorkoutsPutResponse,
  unknown,
  unknown,
  FavoriteWorkoutsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const favoriteWorkoutPutData = request.body;
  const { userId } = request.user;

  const record: DbRecord<'favorite-workout'> = {
    updatedAt: new Date().toISOString(),
    PK: 'favorite-workout',
    SK: FavoriteWorkoutsService.instance.calculateSk(
      userId,
      WorkoutsService.getWorkoutUuid(favoriteWorkoutPutData.workoutId)
    ),
  };
  void (await FavoriteWorkoutsService.instance.put(record));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        favorite: {
          workoutId: favoriteWorkoutPutData.workoutId,
        },
      },
    },
  };
});

export { handler };
