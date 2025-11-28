import {
  SessionsPutRequest,
  SessionsPutResponse,
} from '@shared/models/session';
import { assert } from '@shared/utils/assert';

import { Session } from '../../models/session';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiSession } from './sessions-mapper';

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
