import {
  FavoriteWorkoutsPutRequest,
  favoriteWorkoutsPutRequestSchema,
  FavoriteWorkoutsPutResponse,
} from '@shared/models/favorite-workout';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { DbRecord } from '../../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { apiHandler } from '../../api-utils';
import { WorkoutsService } from '../../../services/workouts-service';

export const handler = apiHandler<FavoriteWorkoutsPutResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { favoriteWorkoutPutData } = validateEvent(req);
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

function validateEvent(req: Request): {
  favoriteWorkoutPutData: FavoriteWorkoutsPutRequest;
} {
  if (!req.body) {
    throw new Error('Invalid request');
  }

  try {
    const favoriteWorkoutPutData = favoriteWorkoutsPutRequestSchema.parse(req.body);
    return { favoriteWorkoutPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
