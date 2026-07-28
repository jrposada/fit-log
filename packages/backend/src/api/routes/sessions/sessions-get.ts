import type {
  SessionsGetQuery,
  SessionsGetResponse,
} from '@jrposada/fit-log-shared/models/sessions/sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { SessionsCursor } from '../../../services/session.ts';
import { getSessions } from '../../../services/session.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSession } from '../../mappers/sessions.ts';

function decodeCursor(raw: string): SessionsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as SessionsCursor;
    if (
      typeof parsed?.completedAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !Types.ObjectId.isValid(parsed.id) ||
      Number.isNaN(Date.parse(parsed.completedAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: SessionsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<SessionsGetResponse, unknown, SessionsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { cursor, ...filters } = request.query;

    const { sessions, nextCursor } = await getSessions({
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sessions: sessions.map(toApiSession),
          nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
        },
      },
    };
  }
);

export { handler };
