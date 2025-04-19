import {
  Exercise,
  Workout,
  WorkoutsGetParams,
  workoutsGetParamsSchema,
  WorkoutsGetResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DbRecord } from '../../../services/aws/db-record';
import { FavoriteWorkoutsService } from '../../../services/favorite-workouts-service';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { ApiResponse } from '@shared/models/api-response';

export const handler = apiHandler<WorkoutsGetResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(event);

    if (params.onlyFavorites) {
      const { userId } = authorizerContext;

      const { items: favorites, lastEvaluatedKey } =
        await FavoriteWorkoutsService.instance.getAll(
          FavoriteWorkoutsService.instance.calculatePartialSk(userId)
        );

      const items = await WorkoutsService.instance.batchGet(
        favorites.map((item) =>
          WorkoutsService.instance.calculateSk(
            userId,
            FavoriteWorkoutsService.getWorkoutUuid(item.SK)
          )
        )
      );

      return {
        statusCode: 200,
        body: calculateApiResponse(items, lastEvaluatedKey),
      };
    }

    const { items, lastEvaluatedKey } = await WorkoutsService.instance.getAll();

    return {
      statusCode: 200,
      body: calculateApiResponse(items, lastEvaluatedKey),
    };
  }
);

function calculateApiResponse(
  workouts: DbRecord<'workout'>[],
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey']
): ApiResponse<WorkoutsGetResponse> {
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
        name: item.name,
      })),
    },
  };
}

function validateEvent(event: APIGatewayProxyEvent): {
  params: Omit<WorkoutsGetParams, 'onlyFavorites'> & { onlyFavorites: boolean };
} {
  try {
    const params = workoutsGetParamsSchema.parse(
      event.queryStringParameters ?? {}
    );
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
