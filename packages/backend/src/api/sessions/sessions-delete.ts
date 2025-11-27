import { assert } from '@shared/utils/assert';
import { toApiResponse } from '../api-utils';
import { SessionsService } from '../../services/sessions-service';
import {
  SessionsDeleteParams,
  SessionsDeleteResponse,
} from '@shared/models/session';

const handler = toApiResponse<SessionsDeleteResponse, SessionsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;
    const { userId } = request.user;

    assert(SessionsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await SessionsService.instance.delete(id));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

export { handler };
