import { SessionsGetByIdResponse } from '@shared/models/session';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsGetByIdResponse>(
  async ({ event }) => {
    const { id } = validateEvent(event);

    const session = await SessionsService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          session: {
            completedAt: session.completedAt,
            id: session.SK,
            workoutDescription: session.workoutDescription,
            workoutName: session.workoutName,
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

  return { id: decodeURIComponent(event.pathParameters.id) };
}
