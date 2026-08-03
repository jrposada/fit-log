import type {
  TrainingSessionsGetQuery,
  TrainingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { TrainingSessionsCursor } from '../../../services/training-session.ts';
import { getTrainingSessions } from '../../../services/training-session.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiTrainingSession } from '../../mappers/training-sessions.ts';

function decodeCursor(raw: string): TrainingSessionsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as TrainingSessionsCursor;
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

function encodeCursor(cursor: TrainingSessionsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toRequestHandler<
  TrainingSessionsGetResponse,
  unknown,
  TrainingSessionsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { cursor, ...filters } = request.query;

  const { trainingSessions, nextCursor } = await getTrainingSessions(
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
        trainingSessions: trainingSessions.map(toApiTrainingSession),
        nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
      },
    },
  };
});

export { handler };
