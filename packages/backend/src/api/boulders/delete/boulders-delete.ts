import { BouldersDeleteResponse } from '@shared/models/boulder';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { BouldersService } from '../../../services/boulders-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<BouldersDeleteResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);
    const { userId } = authorizerContext;

    assert(BouldersService.getUserId(id) === userId, {
      msg: 'Unauthorized',
    });

    void (await BouldersService.instance.delete(id));

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
