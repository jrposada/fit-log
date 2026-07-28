import type {
  SessionsDeleteParams,
  SessionsDeleteResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteSession } from '../../../services/session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

const handler = toApiResponse<SessionsDeleteResponse, SessionsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await deleteSession(id);

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
