import { Exercise, WorkoutsGetByIdResponse } from '@shared/models/workout';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { assert } from '@shared/utils/assert';
import ResourceNotFound from '../../../infrastructure/not-found-error';

export const handler = apiHandler<WorkoutsGetByIdResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);
    const { userId } = authorizerContext;

    const workout = await WorkoutsService.instance.get(id);
    let isFavorite = false;
    try {
      void (await FavoriteWorkoutsService.instance.get(
        FavoriteWorkoutsService.instance.calculateSk(
          userId,
          WorkoutsService.getWorkoutUuid(id)
        )
      ));
      isFavorite = true;
    } catch (error) {
      if (!(error instanceof ResourceNotFound)) {
        throw error;
      }
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          workout: {
            description: workout.description,
            exercises: workout.exercises.map<Exercise>((exercise) => ({
              description: exercise.description,
              intensity: exercise.intensity,
              intensityUnit: exercise.intensityUnit,
              name: exercise.name,
              reps: exercise.reps,
              restBetweenReps: exercise.restBetweenReps,
              restBetweenSets: exercise.restBetweenSets,
              sets: exercise.sets,
              sort: exercise.sort,
            })),
            id: workout.SK,
            isFavorite,
            name: workout.name,
          },
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  id: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { id: decodeURIComponent(event.pathParameters.id) };
}
