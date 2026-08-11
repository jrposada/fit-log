import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import type { ClimbHistoriesGetQueryStatus } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get';
import type {
  ClimbHistoriesStatsGranularity,
  ClimbHistoriesStatsResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-stats';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import type { WithPopulatedRefs } from '../data/infrastructure/with-populated-refs.ts';
import type { WithRequiredRefs } from '../data/infrastructure/with-required-refs.ts';
import type { WithRequiredOwnership } from '../data/models/_collaborator.ts';
import type { ClimbRequiredRefs, IClimb } from '../data/models/climb.ts';
import type {
  ClimbHistoryPopulatedRefs,
  ClimbHistoryRequiredRefs,
  ClimbHistoryStatus,
  IClimbHistory,
} from '../data/models/climb-history.ts';
import {
  ClimbHistory,
  computeTopStatus,
} from '../data/models/climb-history.ts';
import type { IClimbHistoryTry } from '../data/models/climb-history-try.ts';
import type { IImage } from '../data/models/image.ts';
import type { ILocation } from '../data/models/location.ts';
import type { ISector } from '../data/models/sector.ts';
import type { ITrainingSession } from '../data/models/training-session.ts';
import { TrainingSession } from '../data/models/training-session.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import RelatedEntityRequiredError from '../infrastructure/related-entity-required-error.ts';
import { recomputeTrainingSessionSummary } from './training-session.ts';

/** Populated climb-history with all nested refs guaranteed non-null. */
type ValidClimbHistory = WithPopulatedRefs<
  WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs>,
  keyof ClimbHistoryPopulatedRefs,
  {
    climb: WithRequiredOwnership<WithRequiredRefs<IClimb, ClimbRequiredRefs>>;
    location: WithRequiredOwnership<ILocation>;
    sector: WithRequiredOwnership<
      WithPopulatedRefs<
        ISector,
        'images',
        { images: WithRequiredOwnership<IImage>[] }
      >
    >;
  }
>;

/**
 * Type guard that checks the populated climb-history has a non-null climb
 * whose own required refs (location, sector) are also non-null. The climb's
 * image and model3d are optional and not checked here.
 */
function hasValidRefs<T extends { climb: IClimb | null }>(
  h: T
): h is T & { climb: WithRequiredRefs<IClimb, ClimbRequiredRefs> } {
  return h.climb != null && h.climb.location != null && h.climb.sector != null;
}

/**
 * Type guard for a climb-history with non-null direct refs (climb, location,
 * sector as ObjectIds). Use when nested fields don't need to be populated.
 */
function hasRequiredClimbHistoryRefs<T extends IClimbHistory>(
  h: T
): h is T & WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs> {
  return h.climb != null && h.location != null && h.sector != null;
}

/**
 * Loads a climb-history by id with all first-level refs populated and
 * validated. Used after writes, so a missing or dangling doc is an invariant
 * violation, not a 404.
 */
async function getValidClimbHistory(
  id: Types.ObjectId
): Promise<ValidClimbHistory> {
  const populated = await ClimbHistory.findById(id)
    .populate<{
      climb: WithRequiredOwnership<IClimb>;
      location: WithRequiredOwnership<ILocation>;
    }>(['climb', 'location'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    })
    .populate<{ trainingSession: ITrainingSession | null }>('trainingSession');

  assert(populated, { msg: 'ClimbHistory not found after save' });
  if (!hasValidRefs(populated)) {
    throw new Error('ClimbHistory references deleted documents');
  }

  return populated;
}

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the climb-histories list, in decoded (plain JSON) form. */
type ClimbHistoriesCursor = { updatedAt: string; id: string };

type GetClimbHistoriesOptions = {
  limit?: number;
  cursor?: ClimbHistoriesCursor | null;
  climbId?: string;
  locationId?: string;
  sectorId?: string;
  trainingSession?: string;
  status?: ClimbHistoriesGetQueryStatus[];
  startDate?: string;
  endDate?: string;
};

async function getClimbHistories(
  owner: Types.ObjectId,
  options: GetClimbHistoriesOptions
): Promise<{
  climbHistories: ValidClimbHistory[];
  nextCursor: ClimbHistoriesCursor | null;
}> {
  const {
    limit,
    cursor,
    climbId,
    locationId,
    sectorId,
    trainingSession,
    status,
    startDate,
    endDate,
  } = options;

  // Split 'project' out of status array into an isProject filter
  const includeProjects = status?.includes('project') ?? false;
  const dbStatuses = status?.filter((s) => s !== 'project');

  const baseFilter: Record<string, unknown> = {
    owner,
    ...(climbId ? { climb: climbId } : {}),
    ...(locationId ? { location: locationId } : {}),
    ...(sectorId ? { sector: sectorId } : {}),
    ...(trainingSession ? { trainingSession } : {}),
    ...(startDate || endDate
      ? {
          updatedAt: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  const statusClauses: Record<string, unknown>[] = [];
  if (dbStatuses?.length && includeProjects) {
    statusClauses.push({
      $or: [
        { status: { $in: dbStatuses } },
        { isProject: true, status: { $nin: ['send', 'flash'] } },
      ],
    });
  } else if (dbStatuses?.length) {
    baseFilter.status = { $in: dbStatuses };
  } else if (includeProjects) {
    baseFilter.isProject = true;
  }

  if (cursor) {
    const cursorDate = new Date(cursor.updatedAt);
    const cursorId = new Types.ObjectId(cursor.id);
    statusClauses.push({
      $or: [
        { updatedAt: { $lt: cursorDate } },
        { updatedAt: cursorDate, _id: { $lt: cursorId } },
      ],
    });
  }

  if (statusClauses.length > 0) {
    baseFilter.$and = statusClauses;
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const climbHistories = await ClimbHistory.find(baseFilter)
    .sort({ updatedAt: -1, _id: -1 })
    .limit(pageSize + 1)
    .populate<{
      climb: WithRequiredOwnership<IClimb>;
      location: WithRequiredOwnership<ILocation>;
    }>(['climb', 'location'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    })
    .populate<{ trainingSession: ITrainingSession | null }>('trainingSession');

  const hasMore = climbHistories.length > pageSize;
  const pageHistories = hasMore
    ? climbHistories.slice(0, pageSize)
    : climbHistories;

  const validHistories = pageHistories.filter(hasValidRefs);

  const last = pageHistories[pageHistories.length - 1];
  const nextCursor =
    hasMore && last
      ? {
          updatedAt: last.updatedAt.toISOString(),
          id: last._id.toString(),
        }
      : null;

  return { climbHistories: validHistories, nextCursor };
}

async function getClimbHistoryById(
  owner: Types.ObjectId,
  id: string
): Promise<ValidClimbHistory> {
  const climbHistory = await ClimbHistory.findOne({ _id: id, owner })
    .populate<{
      climb: WithRequiredOwnership<IClimb>;
      location: WithRequiredOwnership<ILocation>;
    }>(['climb', 'location'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    })
    .populate<{ trainingSession: ITrainingSession | null }>('trainingSession');

  if (!climbHistory || !hasValidRefs(climbHistory)) {
    throw new ResourceNotFound(`ClimbHistory with id ${id} not found`);
  }

  return climbHistory;
}

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
  avgGradeIndex: number;
};

type SessionsRow = {
  total: number;
  totalClimbs: number;
  avgDurationMs: number | null;
};

type GetClimbHistoriesStatsOptions = {
  locationId?: string;
  sectorId?: string;
  startDate?: string;
  endDate?: string;
  granularity?: ClimbHistoriesStatsGranularity;
};

async function getClimbHistoriesStats(
  owner: Types.ObjectId,
  options: GetClimbHistoriesStatsOptions
): Promise<ClimbHistoriesStatsResponse> {
  const { locationId, sectorId, startDate, endDate, granularity } = options;
  const bucket = granularity ?? 'month';

  const dateRange =
    startDate || endDate
      ? {
          ...(startDate ? { $gte: new Date(startDate) } : {}),
          ...(endDate ? { $lte: new Date(endDate) } : {}),
        }
      : null;

  const historyMatch: Record<string, unknown> = {
    owner,
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
        // Per-period hardest AND mean sent grade. Restrict to real grades
        // (gradeIndex >= 0) so a deleted-climb send can't skew either metric.
        progression: [
          { $match: { isSend: true, gradeIndex: { $gte: 0 } } },
          {
            $group: {
              _id: '$period',
              hardestGradeIndex: { $max: '$gradeIndex' },
              avgGradeIndex: { $avg: '$gradeIndex' },
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
    avgGradeIndex: row.avgGradeIndex ?? null,
  }));

  const sessionMatch: Record<string, unknown> = {
    owner,
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
    summary,
    gradeDistribution,
    activity,
    progression,
    sessions,
  };
}

type UpsertClimbHistoryTryInput = {
  tryId?: string;

  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;
  date?: string;

  climb: string;
  location: string;
  sector: string;
  trainingSession?: string;

  forced?: boolean;
};

async function upsertClimbHistoryTry(
  owner: Types.ObjectId,
  input: UpsertClimbHistoryTryInput
): Promise<ValidClimbHistory> {
  const {
    tryId,
    status,
    attempts,
    notes,
    date,
    climb,
    location,
    sector,
    trainingSession,
    forced,
  } = input;

  if (!tryId && !trainingSession && !forced) {
    throw new RelatedEntityRequiredError('trainingSession', true);
  }

  const newTry: Partial<IClimbHistoryTry> = {
    status,
    attempts,
    notes,
    date: date ? new Date(date) : new Date(),
  };

  let climbHistory;

  if (tryId) {
    climbHistory = await ClimbHistory.findOneAndUpdate(
      {
        climb: new Types.ObjectId(climb),
        owner,
        'tries._id': new Types.ObjectId(tryId),
      },
      {
        $set: {
          'tries.$.status': newTry.status,
          'tries.$.attempts': newTry.attempts,
          'tries.$.notes': newTry.notes,
          'tries.$.date': newTry.date,
        },
      },
      { new: true }
    );

    assert(climbHistory, { msg: 'ClimbHistory or try not found' });

    climbHistory.status = computeTopStatus(climbHistory.tries);
    await climbHistory.save();
  } else {
    climbHistory = await ClimbHistory.findOneAndUpdate(
      { climb: new Types.ObjectId(climb), owner },
      {
        $push: { tries: newTry },
        $setOnInsert: {
          climb: new Types.ObjectId(climb),
          location: new Types.ObjectId(location),
          sector: new Types.ObjectId(sector),
          owner,
          trainingSession: trainingSession
            ? new Types.ObjectId(trainingSession)
            : null,
        },
      },
      { new: true, upsert: true }
    );

    climbHistory.status = computeTopStatus(climbHistory.tries);
    await climbHistory.save();
  }

  const populated = await getValidClimbHistory(climbHistory._id);

  if (populated.trainingSession) {
    await recomputeTrainingSessionSummary(populated.trainingSession._id);
  }

  return populated;
}

type SetClimbHistoryProjectInput = {
  isProject: boolean;

  climb: string;
  location: string;
  sector: string;
};

/**
 * Marks or unmarks a climb as a project. Unprojecting a history that has no
 * tries deletes it and resolves to null.
 */
async function setClimbHistoryProject(
  owner: Types.ObjectId,
  input: SetClimbHistoryProjectInput
): Promise<ValidClimbHistory | null> {
  const { isProject, climb, location, sector } = input;

  if (!isProject) {
    const existing = await ClimbHistory.findOne({
      climb: new Types.ObjectId(climb),
      owner,
      tries: { $size: 0 },
    });

    if (existing) {
      await ClimbHistory.deleteOne({ _id: existing._id });
      return null;
    }
  }

  const climbHistory = await ClimbHistory.findOneAndUpdate(
    { climb: new Types.ObjectId(climb), owner },
    {
      $set: { isProject },
      $setOnInsert: {
        climb: new Types.ObjectId(climb),
        location: new Types.ObjectId(location),
        sector: new Types.ObjectId(sector),
        owner,
        status: 'attempt',
      },
    },
    { new: true, upsert: true }
  );

  return getValidClimbHistory(climbHistory._id);
}

/**
 * Deletes a climb-history, or a single try when `tryId` is given (removing
 * the last try deletes the whole history).
 */
async function deleteClimbHistory(
  owner: Types.ObjectId,
  id: string,
  tryId?: string
): Promise<void> {
  let affectedSessionId: string | null = null;

  if (tryId) {
    const climbHistory = await ClimbHistory.findOne({ _id: id, owner });
    assert(climbHistory, { msg: 'ClimbHistory not found' });

    affectedSessionId = climbHistory.trainingSession?.toString() ?? null;

    climbHistory.tries.pull({ _id: tryId });

    if (climbHistory.tries.length === 0) {
      await ClimbHistory.deleteOne({ _id: id, owner });
    } else {
      climbHistory.status = computeTopStatus(climbHistory.tries);
      await climbHistory.save();
    }
  } else {
    const climbHistory = await ClimbHistory.findOneAndDelete({
      _id: id,
      owner,
    });
    affectedSessionId = climbHistory?.trainingSession?.toString() ?? null;
  }

  if (affectedSessionId) {
    await recomputeTrainingSessionSummary(affectedSessionId);
  }
}

export {
  deleteClimbHistory,
  getClimbHistories,
  getClimbHistoriesStats,
  getClimbHistoryById,
  hasRequiredClimbHistoryRefs,
  hasValidRefs,
  setClimbHistoryProject,
  upsertClimbHistoryTry,
};
export type { ClimbHistoriesCursor, ValidClimbHistory };
