import { Session, SessionsGetResponse } from '@shared/models/session';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsGetResponse>(async (_event) => {
  const { items, lastEvaluatedKey } = await SessionsService.instance.getAll();

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: {
        lastEvaluatedKey,
        sessions: items.map<Session>((item) => ({
          completedAt: new Date(item.completedAt),
          id: item.SK,
        })),
      },
    },
  });
});
