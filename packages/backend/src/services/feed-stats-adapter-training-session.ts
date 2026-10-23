import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';

import { TrainingSession } from '../data/models/training-session.ts';
import type { FeedStatsAdapter } from './feed-stats.ts';

/** Every sport is stored as a `TrainingSession`; each gets its own adapter
 * over its slice of the collection. */
export function createTrainingSessionFeedStatsAdapter(
  sport: Sport
): FeedStatsAdapter {
  return {
    sport,

    async fetch(query) {
      const filter: Record<string, unknown> = {
        owner: query.ownerId,
        sport,
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
}
