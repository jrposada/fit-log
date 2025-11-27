import {
  SessionsGetByIdParams,
  SessionsGetByIdResponse,
} from '@shared/models/session';
import { SessionsService } from '../../services/sessions-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<SessionsGetByIdResponse, SessionsGetByIdParams>(
  async (request) => {
    const { id } = request.params;

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

export { handler };
