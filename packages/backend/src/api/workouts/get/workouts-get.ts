import {
  Exercise,
  Workout,
  WorkoutsGetParams,
  workoutsGetParamsSchema,
  WorkoutsGetResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { DbRecord } from '../../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { ApiResponse } from '@shared/models/api-response';

export const handler = apiHandler<WorkoutsGetResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(req);
    const { userId } = authorizerContext;

    if (params.onlyFavorites) {
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
}: CalculateApiResponseParams): ApiResponse<WorkoutsGetResponse> {
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

function validateEvent(req: Request): {
  params: Omit<WorkoutsGetParams, 'onlyFavorites'> & { onlyFavorites: boolean };
} {
  try {
    const params = workoutsGetParamsSchema.parse(req.query ?? {});
    return {
      params: {
        ...params,
        onlyFavorites: Object.keys(params).includes('onlyFavorites'),
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
