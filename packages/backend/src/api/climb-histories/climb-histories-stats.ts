import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import type {
  ClimbHistoriesStatsQuery,
  ClimbHistoriesStatsResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-stats';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { ClimbHistory } from '../../models/climb-history.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { toApiResponse } from '../api-utils.ts';

const GRADES = [...GRADE_OPTIONS];

/** Map a `GRADE_OPTIONS` index back to its grade, or null for `-1`/missing. */
function gradeFromIndex(index: number | null | undefined): string | null {
  return index === null || index === undefined || index < 0
    ? null
    : (GRADES[index] ?? null);
}

type SummaryRow = {
  totalClimbs: number;
  sends: number;
  flashes: number;
  projects: number;
  totalAttempts: number;
  hardestGradeIndex: number;
};

type GradeDistributionRow = {
  _id: string;
  sends: number;
  attempts: number;
};

type ActivityRow = {
  _id: string;
  climbs: number;
  sends: number;
};

type ProgressionRow = {
  _id: string;
  hardestGradeIndex: number;
};

type SessionsRow = {
  total: number;
  totalClimbs: number;
  avgDurationMs: number | null;
};

const handler = toApiResponse<
  ClimbHistoriesStatsResponse,
  unknown,
  ClimbHistoriesStatsQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { locationId, sectorId, startDate, endDate, granularity } =
    request.query;
  const bucket = granularity ?? 'month';

  const dateRange =
    startDate || endDate
      ? {
          ...(startDate ? { $gte: new Date(startDate) } : {}),
          ...(endDate ? { $lte: new Date(endDate) } : {}),
        }
      : null;

  const historyMatch: Record<string, unknown> = {
    owner: request.user._id,
    ...(locationId ? { location: locationId } : {}),
    ...(sectorId ? { sector: sectorId } : {}),
    ...(dateRange ? { updatedAt: dateRange } : {}),
  };

  const periodExpr =
    bucket === 'week'
      ? { $dateToString: { format: '%G-W%V', date: '$updatedAt' } }
      : { $dateToString: { format: '%Y-%m', date: '$updatedAt' } };

  const [facet] = await ClimbHistory.aggregate<{
    summary: SummaryRow[];
    gradeDistribution: GradeDistributionRow[];
    activity: ActivityRow[];
    progression: ProgressionRow[];
  }>([
    { $match: historyMatch },
    {
      $lookup: {
        from: 'climbs',
        localField: 'climb',
        foreignField: '_id',
        as: 'climbDoc',
      },
    },
    {
      $addFields: {
        grade: { $arrayElemAt: ['$climbDoc.grade', 0] },
        isSend: { $in: ['$status', ['send', 'flash']] },
        attemptsCount: {
          $sum: {
            $map: {
              input: '$tries',
              as: 't',
              in: { $ifNull: ['$$t.attempts', 1] },
            },
          },
        },
        gradeIndex: {
          $indexOfArray: [GRADES, { $arrayElemAt: ['$climbDoc.grade', 0] }],
        },
        period: periodExpr,
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalClimbs: { $sum: 1 },
              sends: { $sum: { $cond: ['$isSend', 1, 0] } },
              flashes: {
                $sum: { $cond: [{ $eq: ['$status', 'flash'] }, 1, 0] },
              },
              projects: { $sum: { $cond: ['$isProject', 1, 0] } },
              totalAttempts: { $sum: '$attemptsCount' },
              hardestGradeIndex: {
                $max: { $cond: ['$isSend', '$gradeIndex', -1] },
              },
            },
          },
        ],
        // Only grades present in GRADE_OPTIONS are reportable (ordered slots);
        // histories with a deleted climb (gradeIndex -1) are excluded here.
        gradeDistribution: [
          { $match: { gradeIndex: { $gte: 0 } } },
          {
            $group: {
              _id: '$grade',
              sends: { $sum: { $cond: ['$isSend', 1, 0] } },
              attempts: { $sum: { $cond: ['$isSend', 0, 1] } },
            },
          },
        ],
        activity: [
          {
            $group: {
              _id: '$period',
              climbs: { $sum: 1 },
              sends: { $sum: { $cond: ['$isSend', 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ],
        progression: [
          { $match: { isSend: true } },
          {
            $group: {
              _id: '$period',
              hardestGradeIndex: { $max: '$gradeIndex' },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const summaryRow = facet?.summary[0];
  const summary = {
    totalClimbs: summaryRow?.totalClimbs ?? 0,
    sends: summaryRow?.sends ?? 0,
    flashes: summaryRow?.flashes ?? 0,
    projects: summaryRow?.projects ?? 0,
    totalAttempts: summaryRow?.totalAttempts ?? 0,
    hardestGrade: gradeFromIndex(summaryRow?.hardestGradeIndex),
  };

  const gradeOrder = new Map<string, number>(
    GRADES.map((grade, index) => [grade, index])
  );
  const gradeDistribution = (facet?.gradeDistribution ?? [])
    .map((row) => ({
      grade: row._id,
      sends: row.sends,
      attempts: row.attempts,
    }))
    .sort(
      (a, b) => (gradeOrder.get(a.grade) ?? 0) - (gradeOrder.get(b.grade) ?? 0)
    );

  const activity = (facet?.activity ?? []).map((row) => ({
    period: row._id,
    climbs: row.climbs,
    sends: row.sends,
  }));

  const progression = (facet?.progression ?? []).map((row) => ({
    period: row._id,
    hardestGrade: gradeFromIndex(row.hardestGradeIndex),
  }));

  const sessionMatch: Record<string, unknown> = {
    owner: request.user._id,
    ...(locationId ? { location: locationId } : {}),
    ...(dateRange ? { startedAt: dateRange } : {}),
  };

  const [sessionsRow] = await TrainingSession.aggregate<SessionsRow>([
    { $match: sessionMatch },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalClimbs: { $sum: { $size: '$climbHistories' } },
        avgDurationMs: {
          $avg: {
            $let: {
              vars: { endedAt: { $ifNull: ['$endedAt', null] } },
              in: {
                $cond: [
                  { $eq: ['$$endedAt', null] },
                  null,
                  { $subtract: ['$$endedAt', '$startedAt'] },
                ],
              },
            },
          },
        },
      },
    },
  ]);

  const sessions = {
    total: sessionsRow?.total ?? 0,
    avgClimbsPerSession: sessionsRow?.total
      ? sessionsRow.totalClimbs / sessionsRow.total
      : 0,
    avgDurationMinutes:
      sessionsRow?.avgDurationMs != null
        ? sessionsRow.avgDurationMs / 60000
        : null,
  };

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        summary,
        gradeDistribution,
        activity,
        progression,
        sessions,
      },
    },
  };
});

export { handler };
