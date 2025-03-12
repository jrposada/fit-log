import { WorkoutsDeleteResponse } from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsDeleteResponse>(
  async (event, authorizerContext) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { workoutId } = validateEvent(event);
    const { userId } = authorizerContext;

    assert(workoutId.startsWith(`workout#${userId}#`), { msg: 'Unauthorized' });

    void (await WorkoutsService.instance.delete(workoutId));

    return Promise.resolve({
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    });
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  workoutId: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { workoutId: decodeURIComponent(event.pathParameters.id) };
}
