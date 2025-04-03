import { SessionsDeleteResponse } from '@shared/models/session';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsDeleteResponse>(
  async (event, authorizerContext) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);
    const { userId } = authorizerContext;

    assert(SessionsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await SessionsService.instance.delete(id));

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
  id: string;
} {
  if (!event.pathParameters?.id) {
    throw new Error('Invalid request');
  }

  return { id: decodeURIComponent(event.pathParameters.id) };
}
