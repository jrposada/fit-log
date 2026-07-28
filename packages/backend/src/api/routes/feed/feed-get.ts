import { SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import type {
  FeedGetQuery,
  FeedGetResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { FeedCursor } from '../../../services/feed.ts';
import { getFeed } from '../../../services/feed.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';

function decodeCursor(raw: string): FeedCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as FeedCursor;
    if (
      typeof parsed?.startedAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !SPORTS.includes(parsed?.sport) ||
      Number.isNaN(Date.parse(parsed.startedAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: FeedCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<FeedGetResponse, unknown, FeedGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { cursor, ...filters } = request.query;

    const { sessions, nextCursor } = await getFeed(request.user._id, {
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sessions,
          nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
        },
      },
    };
  }
);

export { handler };
