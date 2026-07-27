import { SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import type {
  FeedGetQuery,
  FeedGetResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { Types } from 'mongoose';

import { toApiResponse } from '../api-utils.ts';
import { climbingFeedAdapter } from './feed-adapter-climbing.ts';
import type { FeedAdapter, FeedCursor } from './feed-adapters.ts';
import { compareFeedRowsDesc } from './feed-adapters.ts';

const DEFAULT_LIMIT = 20;

/** One adapter per sport collection; new sports register here. */
const feedAdapters: FeedAdapter[] = [climbingFeedAdapter];

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

/**
 * Merged, chronological (newest `startedAt` first) list of sessions across
 * all sport collections. Each adapter over-fetches `limit + 1` rows past the
 * cursor; the union is merge-sorted in memory and sliced, so the page always
 * holds the true top rows of the merged stream. ElasticSearch is the planned
 * replacement for this fan-out/merge, behind the same DTO and filters.
 */
const handler = toApiResponse<FeedGetResponse, unknown, FeedGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit, cursor, sport, locationId, startDate, endDate } =
      request.query;

    const pageSize = limit ?? DEFAULT_LIMIT;
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    // When `sport` is set only that adapter runs — a direct query on one
    // collection.
    const adapters = sport
      ? feedAdapters.filter((adapter) => adapter.sport === sport)
      : feedAdapters;

    const results = await Promise.all(
      adapters.map((adapter) =>
        adapter.fetch({
          ownerId: request.user?._id as Types.ObjectId,
          locationId,
          startDate,
          endDate,
          cursor: decodedCursor,
          limit: pageSize + 1,
        })
      )
    );

    const merged = results.flat().sort(compareFeedRowsDesc);

    const hasMore = merged.length > pageSize;
    const sessions = merged.slice(0, pageSize);

    const last = sessions[sessions.length - 1];
    const nextCursor =
      hasMore && last
        ? encodeCursor({
            startedAt: last.startedAt,
            id: last.id,
            sport: last.sport,
          })
        : null;

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sessions,
          nextCursor,
        },
      },
    };
  }
);

export { handler };
