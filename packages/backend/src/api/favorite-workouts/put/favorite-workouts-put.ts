import {
  FavoriteWorkoutsPutRequest,
  favoriteWorkoutsPutRequestSchema,
  FavoriteWorkoutsPutResponse,
} from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DbRecord } from '../../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { apiHandler } from '../../api-utils';
import { WorkoutsService } from '../../../services/workouts-service';

export const handler = apiHandler<FavoriteWorkoutsPutResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { favoriteWorkoutPutData } = validateEvent(event);
    const { userId } = authorizerContext;

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
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  favoriteWorkoutPutData: FavoriteWorkoutsPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const favoriteWorkoutPutData = favoriteWorkoutsPutRequestSchema.parse(body);
    return { favoriteWorkoutPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
