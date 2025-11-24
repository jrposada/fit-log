import { ClimbsGetByIdResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsGetByIdResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(event);

    const climb = await ClimbsService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: {
            id: climb.SK,
            image: climb.image,
            holds: climb.holds.map((hold) => ({
              x: hold.x,
              y: hold.y,
            })),
            name: climb.name,
            description: climb.description,
            createdAt: climb.createdAt,
            updatedAt: climb.updatedAt,
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
