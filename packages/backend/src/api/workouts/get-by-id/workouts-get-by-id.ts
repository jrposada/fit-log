import { Exercise, WorkoutsGetByIdResponse } from '@shared/models/workout';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsGetByIdResponse>(async (event) => {
  const { id } = validateEvent(event);

  const workout = await WorkoutsService.instance.get(id);

  return Promise.resolve({
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
          name: workout.name,
        },
      },
    },
  });
});

function validateEvent(event: APIGatewayProxyEvent): {
  id: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { id: decodeURIComponent(event.pathParameters.id) };
}
