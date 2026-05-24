import type {
  SessionsDeleteParams,
  SessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/session/session-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { Session } from '../../models/session.ts';
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse<SessionsDeleteResponse, SessionsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await Session.deleteOne({ _id: id });

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
