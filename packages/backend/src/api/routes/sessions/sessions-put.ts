import type {
  SessionsPutRequest,
  SessionsPutResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertSession } from '../../../services/session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSession } from '../../mappers/sessions.ts';

const handler = toApiResponse<
  SessionsPutResponse,
  unknown,
  unknown,
  SessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const session = await upsertSession(request.body);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        session: toApiSession(session),
      },
    },
  };
});

export { handler };
