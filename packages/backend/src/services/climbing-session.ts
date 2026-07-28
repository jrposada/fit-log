import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IClimb } from '../models/climb.ts';
import type {
  ClimbHistoryStatus,
  IClimbHistory,
} from '../models/climb-history.ts';
import { ClimbHistory } from '../models/climb-history.ts';
import type { IClimbingSession } from '../models/climbing-session.ts';
import {
  ClimbingSession,
  EMPTY_CLIMBING_SESSION_SUMMARY,
} from '../models/climbing-session.ts';
import type { ILocation } from '../models/location.ts';
import type { IUser } from '../models/user.ts';
import type { ValidClimbHistoryRefs } from './climb-history.ts';
import { hasRequiredClimbHistoryRefs } from './climb-history.ts';

const GRADES: string[] = [...GRADE_OPTIONS];

/** Fully populated climbing session, as returned to API mappers. */
type ValidClimbingSession = MergeType<
  IClimbingSession,
  {
    climbHistories: MergeType<IClimbHistory, ValidClimbHistoryRefs>[];
    location: ILocation | null;
  }
>;

function withValidClimbHistories<T extends { climbHistories: IClimbHistory[] }>(
  session: T
): MergeType<T, { climbHistories: (IClimbHistory & ValidClimbHistoryRefs)[] }> {
  return Object.assign(session, {
    climbHistories: session.climbHistories.filter(hasRequiredClimbHistoryRefs),
  });
}

const CLIMBING_SESSION_POPULATE = ['location', 'climbHistories'] as const;

type GetClimbingSessionsOptions = {
  limit?: number;
  active?: boolean;
};

async function getClimbingSessions(
  owner: Types.ObjectId,
  options: GetClimbingSessionsOptions
): Promise<ValidClimbingSession[]> {
  const { limit, active } = options;

  const filter: Record<string, unknown> = { owner };
  if (active) {
    filter.endedAt = { $exists: false };
  }

  const query = ClimbingSession.find(filter).sort({ startedAt: -1 });

  if (limit) {
    query.limit(limit);
  }

  const sessions = await query.populate<{
    location: ILocation | null;
    climbHistories: IClimbHistory[];
  }>([...CLIMBING_SESSION_POPULATE]);

  return sessions.map(withValidClimbHistories);
}

async function getClimbingSessionById(
  owner: Types.ObjectId,
  id: string
): Promise<ValidClimbingSession> {
  const session = await ClimbingSession.findOne({
    _id: id,
    owner,
  }).populate<{ location: ILocation | null; climbHistories: IClimbHistory[] }>([
    ...CLIMBING_SESSION_POPULATE,
  ]);

  if (!session) {
    throw new ResourceNotFound(`Training session with id ${id} not found`);
  }

  return withValidClimbHistories(session);
}

type UpsertClimbingSessionInput = {
  id?: string;
  title?: string;
  notes?: string;
  location?: string | null;
};

async function upsertClimbingSession(
  user: IUser,
  input: UpsertClimbingSessionInput
): Promise<ValidClimbingSession> {
  const userId = user._id as Types.ObjectId;

  let sessionId: Types.ObjectId;

  if (input.id) {
    const update: Record<string, unknown> = {};
    if (input.title !== undefined) update.title = input.title;
    if (input.notes !== undefined) update.notes = input.notes;
    if (input.location !== undefined) {
      update.location = input.location
        ? new Types.ObjectId(input.location)
        : null;
    }

    const updated = await ClimbingSession.findOneAndUpdate(
      { _id: input.id, owner: userId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ResourceNotFound(
        `Training session ${input.id} not found or not editable`
      );
    }
    sessionId = updated._id;
  } else {
    const now = new Date();
    const created = await ClimbingSession.create({
      owner: userId,
      title: input.title,
      notes: input.notes,
      location: input.location ? new Types.ObjectId(input.location) : undefined,
      startedAt: now,
      lastActivityAt: now,
      climbHistories: [],
    });
    sessionId = created._id;
  }

  return getClimbingSessionById(userId, sessionId.toString());
}

async function deleteClimbingSession(
  owner: Types.ObjectId,
  id: string
): Promise<void> {
  const result = await ClimbingSession.deleteOne({ _id: id, owner });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(
      `Training session ${id} not found or not deletable`
    );
  }
}

function computeClimbingSessionSummary(
  histories: { status: ClimbHistoryStatus; climb: IClimb | null }[]
): SessionSummaryData {
  const count = histories.length;
  if (count === 0) {
    return { ...EMPTY_CLIMBING_SESSION_SUMMARY };
  }

  // Hardest *sent* grade; only grades present in GRADE_OPTIONS are
  // reportable (ordered slots), mirroring climb-histories-stats.
  let hardestGradeIndex = -1;
  for (const history of histories) {
    if (history.status !== 'send' && history.status !== 'flash') {
      continue;
    }
    const gradeIndex = history.climb ? GRADES.indexOf(history.climb.grade) : -1;
    if (gradeIndex > hardestGradeIndex) {
      hardestGradeIndex = gradeIndex;
    }
  }
  const hardestGrade = GRADES[hardestGradeIndex];

  return {
    headline: `${count} route${count === 1 ? '' : 's'}`,
    count,
    ...(hardestGrade
      ? { metric: { label: 'hardest', value: hardestGrade } }
      : {}),
  };
}

/**
 * Recomputes the denormalized `summary` cache on a climbing session from its
 * climb histories. Must run after every write that touches the session's
 * derived data (try add/edit/remove, history delete), mirroring the
 * `computeTopStatus`-on-every-write pattern one level up.
 */
async function recomputeClimbingSessionSummary(
  sessionId: Types.ObjectId | string
): Promise<void> {
  const histories = await ClimbHistory.find({
    climbingSession: sessionId,
  }).populate<{ climb: IClimb | null }>('climb');

  const summary = computeClimbingSessionSummary(histories);

  await ClimbingSession.updateOne({ _id: sessionId }, { $set: { summary } });
}

export {
  computeClimbingSessionSummary,
  deleteClimbingSession,
  getClimbingSessionById,
  getClimbingSessions,
  recomputeClimbingSessionSummary,
  upsertClimbingSession,
};
export type { ValidClimbingSession };
