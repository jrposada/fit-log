import { FavoriteWorkoutsDeleteResponse } from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { apiHandler } from '../../api-utils';
import { WorkoutsService } from '../../../services/workouts-service';

export const handler = apiHandler<FavoriteWorkoutsDeleteResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { workoutId } = validateEvent(event);
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

function validateEvent(event: APIGatewayProxyEvent): {
  workoutId: string;
} {
  if (!event.pathParameters?.workoutId) {
    throw new Error('Invalid request');
  }

  return { workoutId: decodeURIComponent(event.pathParameters.workoutId) };
}
