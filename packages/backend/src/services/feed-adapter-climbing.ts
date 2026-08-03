import type { SessionSummary } from '@jrposada/fit-log-shared/models/feed/feed';
import { Types } from 'mongoose';

import type { IClimbingSession } from '../data/models/climbing-session.ts';
import {
  ClimbingSession,
  EMPTY_CLIMBING_SESSION_SUMMARY,
} from '../data/models/climbing-session.ts';
import type { FeedAdapter, FeedAdapterQuery } from './feed.ts';

const SPORT = 'climbing' as const;

function toSessionSummary(model: IClimbingSession): SessionSummary {
  return {
    /* Data */
    id: model._id.toString(),
    sport: SPORT,
    title: model.title,
    startedAt: model.startedAt.toISOString(),
    endedAt: model.endedAt ? model.endedAt.toISOString() : undefined,
    // Sessions created before the summary cache existed have no value yet.
    summary: model.summary ?? { ...EMPTY_CLIMBING_SESSION_SUMMARY },

    /* References */
    location: model.location ? model.location.toString() : undefined,
  };
}

/**
 * Resumes the merged stream's total order (`startedAt` desc, `sport` asc,
 * `id` desc) within this collection. Rows at the cursor's exact `startedAt`
 * are included or excluded depending on where this adapter's sport sorts
 * relative to the cursor row's sport; `_id` only breaks ties within the
 * cursor's own collection.
 */
function cursorClause(
  cursor: NonNullable<FeedAdapterQuery['cursor']>
): Record<string, unknown> {
  const cursorDate = new Date(cursor.startedAt);

  if (cursor.sport === SPORT) {
    return {
      $or: [
        { startedAt: { $lt: cursorDate } },
        { startedAt: cursorDate, _id: { $lt: new Types.ObjectId(cursor.id) } },
      ],
    };
  }

  if (SPORT < cursor.sport) {
    // This sport's equal-`startedAt` rows were already emitted.
    return { startedAt: { $lt: cursorDate } };
  }

  return { startedAt: { $lte: cursorDate } };
}

export const climbingFeedAdapter: FeedAdapter = {
  sport: SPORT,

  async distinctLocationIds(ownerId) {
    const locationIds = await ClimbingSession.distinct('location', {
      owner: ownerId,
      location: { $ne: null },
    });
    return locationIds.map((id) => id.toString());
  },

  async fetch(query) {
    const baseFilter: Record<string, unknown> = {
      owner: query.ownerId,
      ...(query.locationId ? { location: query.locationId } : {}),
    };

    const clauses: Record<string, unknown>[] = [];
    if (query.startDate || query.endDate) {
      clauses.push({
        startedAt: {
          ...(query.startDate ? { $gte: new Date(query.startDate) } : {}),
          ...(query.endDate ? { $lte: new Date(query.endDate) } : {}),
        },
      });
    }
    if (query.cursor) {
      clauses.push(cursorClause(query.cursor));
    }
    if (clauses.length > 0) {
      baseFilter.$and = clauses;
    }

    const sessions = await ClimbingSession.find(baseFilter)
      .sort({ startedAt: -1, _id: -1 })
      .limit(query.limit);

    return sessions.map(toSessionSummary);
  },
};
