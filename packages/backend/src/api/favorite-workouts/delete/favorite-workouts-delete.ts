import { FavoriteWorkoutsDeleteResponse } from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { apiHandler } from '../../api-utils';
import { WorkoutsService } from '../../../services/workouts-service';

export const handler = apiHandler<FavoriteWorkoutsDeleteResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { workoutId } = validateEvent(req);
    const { userId } = authorizerContext;

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
  }
);

function validateEvent(req: Request): {
  workoutId: string;
} {
  if (!req.params?.id) {
    throw new Error('Invalid request');
  }

  return { workoutId: decodeURIComponent(req.params.id) };
}
