import {
  Session,
  SessionsGetParams,
  sessionsGetParamsSchema,
  SessionsGetResponse,
} from '@shared/models/session';
import { SessionsService } from '../../services/sessions-service';
import { apiHandler } from '../api-utils';
import { Request } from 'express';
import { WorkoutsService } from '../../services/workouts-service';

export const handler = apiHandler<SessionsGetResponse>(async ({ req }) => {
  const { params } = validateEvent(req);

  const userId = params.workoutId
    ? WorkoutsService.getUserId(params.workoutId)
    : undefined;

  const { items, lastEvaluatedKey } = await SessionsService.instance.getAll(
    userId && params.workoutId
      ? SessionsService.instance.calculatePartialSk(userId, params.workoutId)
      : undefined
  );

  return {
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
  };
});

function validateEvent(req: Request): {
  params: SessionsGetParams;
} {
  try {
    const params = sessionsGetParamsSchema.parse(req.query ?? {});
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
