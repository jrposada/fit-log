import { WorkoutsDeleteResponse } from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsDeleteResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);
    const { userId } = authorizerContext;

    assert(WorkoutsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await WorkoutsService.instance.delete(id));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  id: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { id: decodeURIComponent(event.pathParameters.id) };
}
