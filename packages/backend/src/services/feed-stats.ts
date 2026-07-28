import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import type {
  FeedStatsGranularity,
  FeedStatsResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-stats';
import type { Types } from 'mongoose';

import { climbingFeedStatsAdapter } from './feed-stats-adapter-climbing.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

export type FeedStatsAdapterQuery = {
  ownerId: Types.ObjectId;
  startDate?: string;
  endDate?: string;
};

export type FeedStatsRow = {
  startedAt: Date;
  endedAt?: Date;
};

/**
 * Per-sport read adapter for the cross-sport stats layer. Mirrors the feed
 * adapter contract but returns only the shared base fields needed for
 * aggregation — no pagination, since stats need every matching row in range.
 * ElasticSearch later replaces the fan-out engine, not this contract.
 */
export interface FeedStatsAdapter {
  sport: Sport;
  fetch(query: FeedStatsAdapterQuery): Promise<FeedStatsRow[]>;
}

/** One adapter per sport collection; new sports register here. */
const feedStatsAdapters: FeedStatsAdapter[] = [climbingFeedStatsAdapter];

/** `en-CA` formats as `YYYY-MM-DD`, giving a stable calendar-day key. */
function dayKeyInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    // Unknown/invalid IANA timezone — fall back to UTC rather than 500ing.
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}

/** UTC month bucket, matching the `%Y-%m` label used by climb-histories-stats. */
function monthPeriod(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

/**
 * UTC ISO-week bucket (`YYYY-Www`), matching the `%G-W%V` label used by
 * climb-histories-stats.
 */
function weekPeriod(date: Date): string {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function periodOf(date: Date, granularity: FeedStatsGranularity): string {
  return granularity === 'week' ? weekPeriod(date) : monthPeriod(date);
}

/** Parses a `YYYY-MM-DD` day key back into a UTC-midnight timestamp. */
function dayKeyToMs(key: string): number {
  const [year, month, day] = key.split('-').map(Number) as [
    number,
    number,
    number,
  ];
  return Date.UTC(year, month - 1, day);
}

/** Longest run of consecutive values (each exactly one day apart), ascending. */
function longestConsecutiveRun(sortedDayMs: number[]): number {
  const [first, ...rest] = sortedDayMs;
  if (first === undefined) {
    return 0;
  }

  let longest = 1;
  let run = 1;
  let prev = first;
  for (const ms of rest) {
    run = ms - prev === DAY_MS ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = ms;
  }
  return longest;
}

/** Run of consecutive days walking backward from the most recent one. */
function currentConsecutiveRun(sortedDayMs: number[]): number {
  const [last, ...rest] = [...sortedDayMs].reverse();
  if (last === undefined) {
    return 0;
  }

  let run = 1;
  let prev = last;
  for (const ms of rest) {
    if (prev - ms !== DAY_MS) {
      break;
    }
    run++;
    prev = ms;
  }
  return run;
}

/** Longest and current run of consecutive active calendar days. */
function computeStreaks(
  dayKeys: Set<string>,
  timezone: string
): { longestStreak: number; currentStreak: number } {
  if (dayKeys.size === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  const sortedDayMs = Array.from(dayKeys)
    .map(dayKeyToMs)
    .sort((a, b) => a - b);

  const now = new Date();
  const todayKey = dayKeyInTimezone(now, timezone);
  const yesterdayKey = dayKeyInTimezone(
    new Date(now.getTime() - DAY_MS),
    timezone
  );
  const lastDayKey = Array.from(dayKeys).sort().at(-1);

  return {
    longestStreak: longestConsecutiveRun(sortedDayMs),
    currentStreak:
      lastDayKey === todayKey || lastDayKey === yesterdayKey
        ? currentConsecutiveRun(sortedDayMs)
        : 0,
  };
}

type GetFeedStatsOptions = {
  sport?: Sport;
  startDate?: string;
  endDate?: string;
  granularity?: FeedStatsGranularity;
  timezone?: string;
};

/**
 * Cross-sport stats, fanned out across the per-sport session collections and
 * aggregated in memory. Only derives metrics from shared base fields
 * (`startedAt`, `endedAt`, `sport`) — the layer ElasticSearch absorbs first.
 */
async function getFeedStats(
  ownerId: Types.ObjectId,
  options: GetFeedStatsOptions
): Promise<FeedStatsResponse> {
  const { sport, startDate, endDate, granularity = 'month' } = options;
  const timezone = options.timezone ?? 'UTC';

  const adapters = sport
    ? feedStatsAdapters.filter((adapter) => adapter.sport === sport)
    : feedStatsAdapters;

  const perSportRows = await Promise.all(
    adapters.map(async (adapter) => ({
      sport: adapter.sport,
      rows: await adapter.fetch({ ownerId, startDate, endDate }),
    }))
  );

  const totalSessions = perSportRows.reduce(
    (sum, { rows }) => sum + rows.length,
    0
  );

  const dayKeys = new Set<string>();
  const activityByPeriod = new Map<string, number>();
  let totalDurationMinutes = 0;

  for (const { rows } of perSportRows) {
    for (const row of rows) {
      dayKeys.add(dayKeyInTimezone(row.startedAt, timezone));

      const period = periodOf(row.startedAt, granularity);
      activityByPeriod.set(period, (activityByPeriod.get(period) ?? 0) + 1);

      if (row.endedAt) {
        totalDurationMinutes +=
          (row.endedAt.getTime() - row.startedAt.getTime()) / 60000;
      }
    }
  }

  const { longestStreak, currentStreak } = computeStreaks(dayKeys, timezone);

  const activity = Array.from(activityByPeriod.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => (a.period < b.period ? -1 : 1));

  const bySport = perSportRows.map(({ sport: s, rows }) => ({
    sport: s,
    count: rows.length,
    share: totalSessions ? rows.length / totalSessions : 0,
  }));

  return {
    summary: {
      totalSessions,
      totalActiveDays: dayKeys.size,
      currentStreak,
      longestStreak,
      totalDurationMinutes,
    },
    activity,
    bySport,
  };
}

export { getFeedStats };
