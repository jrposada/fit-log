import type {
  ClimbingSessionsGetQuery,
  ClimbingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { ClimbingSessionsCursor } from '../../../services/climbing-session.ts';
import { getClimbingSessions } from '../../../services/climbing-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

function decodeCursor(raw: string): ClimbingSessionsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as ClimbingSessionsCursor;
    if (
      typeof parsed?.startedAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !Types.ObjectId.isValid(parsed.id) ||
      Number.isNaN(Date.parse(parsed.startedAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: ClimbingSessionsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toRequestHandler<
  ClimbingSessionsGetResponse,
  unknown,
  ClimbingSessionsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { cursor, ...filters } = request.query;

  const { climbingSessions, nextCursor } = await getClimbingSessions(
    request.user._id,
    {
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    }
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbingSessions: climbingSessions.map(toApiClimbingSession),
        nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
      },
    },
  };
});

export { handler };
