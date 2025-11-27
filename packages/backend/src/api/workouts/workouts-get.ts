import {
  Exercise,
  Workout,
  WorkoutsGetQuery,
  WorkoutsGetResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { DbRecord } from '../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../services/favorite-workouts-service';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { ApiResponse } from '@shared/models/api-response';

const handler = toApiResponse<WorkoutsGetResponse, unknown, WorkoutsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const query = request.query;
    const { userId } = request.user;

    if (query.onlyFavorites) {
      const { items: favorites, lastEvaluatedKey } =
        await FavoriteWorkoutsService.instance.getAll(
          FavoriteWorkoutsService.instance.calculatePartialSk(userId)
        );

      const workouts = await WorkoutsService.instance.batchGet(
        favorites.map((favorite) =>
          WorkoutsService.instance.calculateSk(
            userId,
            FavoriteWorkoutsService.getWorkoutUuid(favorite.SK)
          )
        )
      );

      return {
        statusCode: 200,
        body: calculateApiResponse({
          favoritesByWorkoutUuid: favorites.reduce<Record<string, true>>(
            (reduced, favorite) => {
              reduced[FavoriteWorkoutsService.getWorkoutUuid(favorite.SK)] =
                true;
              return reduced;
            },
            {}
          ),
          lastEvaluatedKey,
          workouts,
        }),
      };
    }

    const { items: workouts, lastEvaluatedKey } =
      await WorkoutsService.instance.getAll();
    const favorites = await FavoriteWorkoutsService.instance.batchGet(
      workouts.map((workout) =>
        FavoriteWorkoutsService.instance.calculateSk(
          userId,
          WorkoutsService.getWorkoutUuid(workout.SK)
        )
      )
    );

    return {
      statusCode: 200,
      body: calculateApiResponse({
        favoritesByWorkoutUuid: favorites.reduce<Record<string, true>>(
          (reduced, favorite) => {
            reduced[FavoriteWorkoutsService.getWorkoutUuid(favorite.SK)] = true;
            return reduced;
          },
          {}
        ),
        lastEvaluatedKey,
        workouts,
      }),
    };
  }
);

type CalculateApiResponseParams = {
  favoritesByWorkoutUuid: Record<string, true>;
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
  workouts: DbRecord<'workout'>[];
};
function calculateApiResponse({
  favoritesByWorkoutUuid,
  lastEvaluatedKey,
  workouts,
}: CalculateApiResponseParams): ApiResponse<{
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
  workouts: Workout[];
}> {
  return {
    success: true,
    data: {
      lastEvaluatedKey,
      workouts: workouts.map<Workout>((item) => ({
        description: item.description,
        exercises: item.exercises.map<Exercise>((exercise) => ({
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
        id: item.SK,
        isFavorite:
          favoritesByWorkoutUuid[WorkoutsService.getWorkoutUuid(item.SK)],
        name: item.name,
      })),
    },
  };
}

export { handler };
