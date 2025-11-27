import {
  SessionsDeleteParams,
  SessionsDeleteResponse,
} from '@shared/models/session';
import { assert } from '@shared/utils/assert';

import { SessionsService } from '../../services/sessions-service';
import { toApiResponse } from '../api-utils';

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
