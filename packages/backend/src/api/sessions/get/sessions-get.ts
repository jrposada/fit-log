import {
  Session,
  SessionsGetParams,
  sessionsGetParamsSchema,
  SessionsGetResponse,
} from '@shared/models/session';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { WorkoutsService } from '../../../services/workouts-service';

export const handler = apiHandler<SessionsGetResponse>(async ({ event }) => {
  const { params } = validateEvent(event);
  console.log({ params });

  const userId = params.workoutId
    ? WorkoutsService.getUserId(params.workoutId)
    : undefined;

  const { items, lastEvaluatedKey } = await SessionsService.instance.getAll(
    userId && params.workoutId
      ? SessionsService.instance.calculateSkByWorkoutId(
          userId,
          params.workoutId
        )
      : undefined
  );

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: {
        lastEvaluatedKey,
        sessions: items.map<Session>((item) => ({
          completedAt: item.completedAt,
          id: item.SK,
          workoutDescription: item.workoutDescription,
          workoutName: item.workoutName,
        })),
      },
    },
  });
});

function validateEvent(event: APIGatewayProxyEvent): {
  params: SessionsGetParams;
} {
  try {
    const params = sessionsGetParamsSchema.parse(
      event.queryStringParameters ?? {}
    );
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
