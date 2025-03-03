import { Workout, WorkoutsPutResponse } from '@shared/models/workout';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const handler = apiHandler<WorkoutsPutResponse>(async (_event) => {
  const { workout } = validateEvent(event);
  const { items, lastEvaluatedKey } = await WorkoutsService.instance.put();

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: {
        lastEvaluatedKey,
        workouts: items.map<Workout>((item) => ({
          description: item.description,
          exercises: item.exercises.map((exercise) => ({
            intensity: exercise.intensity,
            intensityUnit: exercise.intensityUnit,
            reps: exercise.reps,
            restBetweenReps: exercise.restBetweenReps,
            restBetweenSets: exercise.restBetweenSets,
            sets: exercise.sets,
          })),
          id: item.PK,
          name: item.name,
        })),
      },
    },
  });
});

function validateEvent(event: APIGatewayProxyEvent): {
  workout: Workout;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);

    if (!body.email || !body.password) {
      throw new Error('Invalid request');
    }

    return {
      email: body.email,
      password: body.password,
    };
  } catch {
    throw new Error('Invalid request');
  }
}
