import { BouldersGetByIdResponse } from '@shared/models/boulder';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { BouldersService } from '../../../services/boulders-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<BouldersGetByIdResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);

    const boulder = await BouldersService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          boulder: {
            id: boulder.SK,
            image: boulder.image,
            holds: boulder.holds.map((hold) => ({
              x: hold.x,
              y: hold.y,
            })),
            name: boulder.name,
            description: boulder.description,
            createdAt: boulder.createdAt,
            updatedAt: boulder.updatedAt,
          },
        },
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

  return { id: event.pathParameters.id };
}
