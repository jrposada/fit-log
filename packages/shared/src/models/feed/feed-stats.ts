import z from 'zod';

import { Sport, SPORTS } from '../../common/sports/sports.ts';

export const FEED_STATS_GRANULARITIES = ['week', 'month'] as const;
export type FeedStatsGranularity = (typeof FEED_STATS_GRANULARITIES)[number];

export type FeedStatsQuery = {
  sport?: Sport;
  startDate?: string;
  endDate?: string;
  granularity?: FeedStatsGranularity;
  /** IANA timezone (e.g. "Europe/Madrid") used to bucket sessions into
   * calendar days for active-days/streak. Defaults to UTC when omitted. */
  timezone?: string;
};

export const feedStatsQuerySchema = z.object({
  sport: z.enum(SPORTS).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  granularity: z.enum(FEED_STATS_GRANULARITIES).optional(),
  timezone: z.string().optional(),
});

export type FeedStatsSummary = {
  totalSessions: number;
  totalActiveDays: number;
  currentStreak: number;
  longestStreak: number;
  totalDurationMinutes: number;
};

export type FeedStatsActivityEntry = {
  period: string;
  count: number;
};

export type FeedStatsBySportEntry = {
  sport: Sport;
  count: number;
  share: number;
};

export type FeedStatsResponse = {
  summary: FeedStatsSummary;
  activity: FeedStatsActivityEntry[];
  bySport: FeedStatsBySportEntry[];
};
