import {
  WorkoutsPutRequest,
  workoutsPutRequestSchema,
  WorkoutsPutResponse,
} from '@shared/models/workout';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { DbRecord } from '../../../services/aws/db-record';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsPutResponse>(async (event) => {
  const { workoutPutData } = validateEvent(event);
  // TODO: user-id
  const userId = 'test-user-id';

  const record: DbRecord<'workout'> = {
    description: workoutPutData.description,
    exercises: workoutPutData.exercises,
    lastUpdated: new Date().toUTCString(),
    name: workoutPutData.name,
    PK: 'workout',
    SK:
      (workoutPutData.id as DbRecord<'workout'>['SK']) ??
      `workout#${userId}#${uuid()}`,
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
});

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
