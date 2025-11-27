import {
  Exercise,
  WorkoutsGetByIdParams,
  WorkoutsGetByIdResponse,
} from '@shared/models/workout';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';
import { FavoriteWorkoutsService } from '../../services/favorite-workouts-service';
import { assert } from '@shared/utils/assert';
import ResourceNotFound from '../../infrastructure/not-found-error';

const handler = toApiResponse<WorkoutsGetByIdResponse, WorkoutsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;
    const { userId } = request.user;

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

export { handler };
