import {
  FavoriteWorkoutsDeleteParams,
  FavoriteWorkoutsDeleteResponse,
} from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';

import { FavoriteWorkoutsService } from '../../services/favorite-workouts-service';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  FavoriteWorkoutsDeleteResponse,
  FavoriteWorkoutsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const workoutId = request.params.id;
  const { userId } = request.user;

  void (await FavoriteWorkoutsService.instance.delete(
    FavoriteWorkoutsService.instance.calculateSk(
      userId,
      WorkoutsService.getWorkoutUuid(workoutId)
    )
  ));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
