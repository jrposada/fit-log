import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import type { SessionSummary } from '@jrposada/fit-log-shared/models/feed/feed';
import type { Types } from 'mongoose';

import { climbingFeedAdapter } from './feed-adapter-climbing.ts';

const DEFAULT_LIMIT = 20;

/**
 * Keyset cursor into the merged cross-sport stream. Rows are ordered by
 * `startedAt` desc, then `sport` asc, then `id` desc — every adapter's
 * cursor filter and the in-memory merge must apply this same total order.
 */
export type FeedCursor = {
  startedAt: string;
  id: string;
  sport: Sport;
};

export type FeedAdapterQuery = {
  ownerId: Types.ObjectId;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  cursor: FeedCursor | null;
  /** Over-fetch size (page size + 1) so the merged stream can detect more rows. */
  limit: number;
};

/**
 * Per-sport read adapter for the cross-sport feed. Each adapter knows how to
 * query its own session collection with the shared filters and projects its
 * documents into the common `SessionSummary` DTO. ElasticSearch later
 * replaces the fan-out/merge engine, not this contract.
 */
export interface FeedAdapter {
  sport: Sport;
  fetch(query: FeedAdapterQuery): Promise<SessionSummary[]>;
  /** Distinct location ids referenced by this owner's sessions in this sport. */
  distinctLocationIds(ownerId: Types.ObjectId): Promise<string[]>;
}

/** Total order of the merged stream: `startedAt` desc, `sport` asc, `id` desc. */
function compareFeedRowsDesc(a: SessionSummary, b: SessionSummary): number {
  // ISO-8601 strings compare lexicographically in chronological order.
  if (a.startedAt !== b.startedAt) {
    return a.startedAt < b.startedAt ? 1 : -1;
  }
  if (a.sport !== b.sport) {
    return a.sport < b.sport ? -1 : 1;
  }
  if (a.id !== b.id) {
    return a.id < b.id ? 1 : -1;
  }
  return 0;
}

/** One adapter per sport collection; new sports register here. */
const feedAdapters: FeedAdapter[] = [climbingFeedAdapter];

type GetFeedOptions = {
  sport?: Sport;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  cursor?: FeedCursor | null;
  limit?: number;
};

/**
 * Merged, chronological (newest `startedAt` first) list of sessions across
 * all sport collections. Each adapter over-fetches `limit + 1` rows past the
 * cursor; the union is merge-sorted in memory and sliced, so the page always
 * holds the true top rows of the merged stream. ElasticSearch is the planned
 * replacement for this fan-out/merge, behind the same DTO and filters.
 */
async function getFeed(
  ownerId: Types.ObjectId,
  options: GetFeedOptions
): Promise<{ sessions: SessionSummary[]; nextCursor: FeedCursor | null }> {
  const { sport, locationId, startDate, endDate, cursor, limit } = options;

  const pageSize = limit ?? DEFAULT_LIMIT;

  // When `sport` is set only that adapter runs — a direct query on one
  // collection.
  const adapters = sport
    ? feedAdapters.filter((adapter) => adapter.sport === sport)
    : feedAdapters;

  const results = await Promise.all(
    adapters.map((adapter) =>
      adapter.fetch({
        ownerId,
        locationId,
        startDate,
        endDate,
        cursor: cursor ?? null,
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
      ? { startedAt: last.startedAt, id: last.id, sport: last.sport }
      : null;

  return { sessions, nextCursor };
}

/**
 * Sport(s) referencing each location the owner has trained at — the same
 * fan-out shape as {@link getFeed}, reused to derive map pins from the
 * per-sport collections instead of a manual location→sport tag.
 */
async function getSportsByLocationId(
  ownerId: Types.ObjectId
): Promise<Map<string, Sport[]>> {
  const results = await Promise.all(
    feedAdapters.map(async (adapter) => ({
      sport: adapter.sport,
      locationIds: await adapter.distinctLocationIds(ownerId),
    }))
  );

  const sportsByLocationId = new Map<string, Sport[]>();
  for (const { sport, locationIds } of results) {
    for (const locationId of locationIds) {
      const sports = sportsByLocationId.get(locationId) ?? [];
      sports.push(sport);
      sportsByLocationId.set(locationId, sports);
    }
  }
  return sportsByLocationId;
}

export { getFeed, getSportsByLocationId };
