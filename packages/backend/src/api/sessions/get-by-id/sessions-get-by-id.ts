import { SessionsGetByIdResponse } from '@shared/models/session';
import { Request } from 'express';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsGetByIdResponse>(async ({ req }) => {
  const { id } = validateEvent(req);

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
});

function validateEvent(req: Request): {
  id: string;
} {
  if (!req.params?.id) {
    throw new Error('Invalid request');
  }

  return { id: decodeURIComponent(req.params.id) };
}
