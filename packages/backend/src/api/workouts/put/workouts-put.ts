import {
  WorkoutsPutRequest,
  workoutsPutRequestSchema,
  WorkoutsPutResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DbRecord } from '../../../services/aws/db-record';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsPutResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { workoutPutData } = validateEvent(event);
    const { userId } = authorizerContext;

    const record: DbRecord<'workout'> = {
      description: workoutPutData.description,
      exercises: workoutPutData.exercises.map<
        DbRecord<'workout'>['exercises'][number]
      >((exercise) => ({
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
      lastUpdated: new Date().toISOString(),
      name: workoutPutData.name,
      PK: 'workout',
      SK:
        (workoutPutData.id as DbRecord<'workout'>['SK']) ??
        WorkoutsService.instance.newSk(userId),
    };
    void (await WorkoutsService.instance.put(record));

    return Promise.resolve({
      statusCode: 200,
      body: {
        success: true,
        data: {
          workout: {
            description: record.description,
            exercises: record.exercises,
            id: record.SK,
            name: record.name,
          },
        },
      },
    });
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  workoutPutData: WorkoutsPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const workoutPutData = workoutsPutRequestSchema.parse(body);
    return { workoutPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
