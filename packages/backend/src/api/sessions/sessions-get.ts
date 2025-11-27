import {
  Session,
  SessionsGetQuery,
  SessionsGetResponse,
} from '@shared/models/session';

import { SessionsService } from '../../services/sessions-service';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<SessionsGetResponse, unknown, SessionsGetQuery>(
  async (request) => {
    const params = request.query;

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
  }
);

export { handler };
