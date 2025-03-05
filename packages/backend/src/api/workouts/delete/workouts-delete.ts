import { WorkoutsDeleteResponse } from '@shared/models/workout';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsDeleteResponse>(async (event) => {
  // TODO: verify workout owner through userId
  const { workoutId } = validateEvent(event);

  void (await WorkoutsService.instance.delete(workoutId));

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  });
});

function validateEvent(event: APIGatewayProxyEvent): {
  workoutId: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { workoutId: event.pathParameters.id };
}
