import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import type { SessionSummary } from '@jrposada/fit-log-shared/models/feed/feed';
import type { Types } from 'mongoose';

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
}

/** Total order of the merged stream: `startedAt` desc, `sport` asc, `id` desc. */
export function compareFeedRowsDesc(
  a: SessionSummary,
  b: SessionSummary
): number {
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
