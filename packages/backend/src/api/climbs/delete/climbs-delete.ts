import { ClimbsDeleteResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsDeleteResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);
    const { userId } = authorizerContext;

    assert(ClimbsService.getUserId(id) === userId, {
      msg: 'Unauthorized',
    });

    void (await ClimbsService.instance.delete(id));

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
