import { TrainingSession } from '../data/models/training-session.ts';
import type { FeedStatsAdapter } from './feed-stats.ts';

const SPORT = 'climbing' as const;

export const climbingFeedStatsAdapter: FeedStatsAdapter = {
  sport: SPORT,

  async fetch(query) {
    const filter: Record<string, unknown> = {
      owner: query.ownerId,
      ...(query.startDate || query.endDate
        ? {
            startedAt: {
              ...(query.startDate ? { $gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { $lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
    };

    const sessions = await TrainingSession.find(filter)
      .select({ startedAt: 1, endedAt: 1 })
      .lean();

    return sessions.map((session) => ({
      startedAt: session.startedAt,
      endedAt: session.endedAt,
    }));
  },
};
