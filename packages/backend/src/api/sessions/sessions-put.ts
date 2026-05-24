import type {
  SessionsPutRequest,
  SessionsPutResponse,
} from '@jrposada/fit-log-shared/models/session/session-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { Session } from '../../models/session.ts';
import { upsertDocument } from '../../utils/upsert-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSession } from './sessions-mapper.ts';

const handler = toApiResponse<
  SessionsPutResponse,
  unknown,
  unknown,
  SessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sessionPutData = request.body;

  const session = await upsertDocument(Session, sessionPutData.id, {
    completedAt: new Date(sessionPutData.completedAt),
  });

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
