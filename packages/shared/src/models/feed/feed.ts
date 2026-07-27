import { Sport } from '../../common/sports/sports.ts';

export type SessionSummaryMetric = {
  label: string;
  value: string;
};

/**
 * Denormalized headline metrics maintained by the owning sport package on
 * every write that touches the session's derived data. Readers (feed,
 * dashboard) only ever read this cached value — it is never authoritative.
 */
export type SessionSummaryData = {
  headline: string;
  metric?: SessionSummaryMetric;
  count?: number;
};

/**
 * Common projection of a per-sport session entity for the cross-sport feed.
 * Deep sport data is never included; detail is fetched from each sport's own
 * endpoint.
 */
export type SessionSummary = {
  /* Data */
  id: string;
  sport: Sport;
  title: string;
  startedAt: string;
  endedAt?: string;
  summary: SessionSummaryData;

  /* References */
  location?: string;
};
