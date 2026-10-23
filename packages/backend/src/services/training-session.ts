import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import { validatePlannedSession } from '@jrposada/fit-log-shared/common/training-plans/validate-planned-session';
import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import type { TrainingSessionItemLog } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import type { WithRequiredRefs } from '../data/infrastructure/with-required-refs.ts';
import type { WithRequiredOwnership } from '../data/models/_collaborator.ts';
import type { ClimbRequiredRefs, IClimb } from '../data/models/climb.ts';
import type {
  ClimbHistoryRequiredRefs,
  ClimbHistoryStatus,
  IClimbHistory,
} from '../data/models/climb-history.ts';
import { ClimbHistory } from '../data/models/climb-history.ts';
import type { ILocation } from '../data/models/location.ts';
import { PlanEnrollment } from '../data/models/plan-enrollment.ts';
import type { ITrainingSession } from '../data/models/training-session.ts';
import {
  EMPTY_TRAINING_SESSION_SUMMARY,
  TrainingSession,
} from '../data/models/training-session.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import ValidationError from '../infrastructure/validation-error.ts';
import { hasRequiredRefs as hasRequiredClimbRefs } from './climb.ts';
import { hasRequiredClimbHistoryRefs } from './climb-history.ts';
import { getTrainingPlanById } from './training-plan.ts';

const GRADES: string[] = [...GRADE_OPTIONS];

/** Fully populated training session, as returned to API mappers. */
type ValidTrainingSession = MergeType<
  ITrainingSession,
  {
    climbHistories: WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs>[];
    location: WithRequiredOwnership<ILocation> | null;
    currentClimb: WithRequiredOwnership<
      WithRequiredRefs<IClimb, ClimbRequiredRefs>
    > | null;
  }
>;

function withValidClimbHistories<T extends { climbHistories: IClimbHistory[] }>(
  session: T
): MergeType<
  T,
  {
    climbHistories: WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs>[];
  }
> {
  return Object.assign(session, {
    climbHistories: session.climbHistories.filter(hasRequiredClimbHistoryRefs),
  });
}

function withValidCurrentClimb<T extends { currentClimb: IClimb | null }>(
  session: T
): MergeType<
  T,
  {
    currentClimb: WithRequiredOwnership<
      WithRequiredRefs<IClimb, ClimbRequiredRefs>
    > | null;
  }
> {
  return Object.assign(session, {
    currentClimb:
      session.currentClimb && hasRequiredClimbRefs(session.currentClimb)
        ? session.currentClimb
        : null,
  });
}

const TRAINING_SESSION_POPULATE = [
  'location',
  'climbHistories',
  'currentClimb',
] as const;

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the training-sessions list, in decoded (plain JSON) form. */
type TrainingSessionsCursor = { startedAt: string; id: string };

type GetTrainingSessionsOptions = {
  limit?: number;
  cursor?: TrainingSessionsCursor | null;
  active?: boolean;
  enrollment?: string;
};

async function getTrainingSessions(
  owner: Types.ObjectId,
  options: GetTrainingSessionsOptions
): Promise<{
  trainingSessions: ValidTrainingSession[];
  nextCursor: TrainingSessionsCursor | null;
}> {
  const { limit, cursor, active, enrollment } = options;

  const filter: Record<string, unknown> = { owner };
  if (active) {
    filter.endedAt = { $exists: false };
  }
  if (enrollment) {
    filter['planned.enrollment'] = enrollment;
  }
  if (cursor) {
    const cursorDate = new Date(cursor.startedAt);
    const cursorId = new Types.ObjectId(cursor.id);
    filter.$or = [
      { startedAt: { $lt: cursorDate } },
      { startedAt: cursorDate, _id: { $lt: cursorId } },
    ];
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const sessions = await TrainingSession.find(filter)
    .sort({ startedAt: -1, _id: -1 })
    .limit(pageSize + 1)
    .populate<{
      location: WithRequiredOwnership<ILocation> | null;
      climbHistories: IClimbHistory[];
      currentClimb: WithRequiredOwnership<IClimb> | null;
    }>([...TRAINING_SESSION_POPULATE]);

  const hasMore = sessions.length > pageSize;
  const pageSessions = hasMore ? sessions.slice(0, pageSize) : sessions;

  const last = pageSessions[pageSessions.length - 1];
  const nextCursor =
    hasMore && last
      ? { startedAt: last.startedAt.toISOString(), id: last._id.toString() }
      : null;

  return {
    trainingSessions: pageSessions.map((session) =>
      withValidCurrentClimb(withValidClimbHistories(session))
    ),
    nextCursor,
  };
}

async function getTrainingSessionById(
  owner: Types.ObjectId,
  id: string
): Promise<ValidTrainingSession> {
  const session = await TrainingSession.findOne({
    _id: id,
    owner,
  }).populate<{
    location: WithRequiredOwnership<ILocation> | null;
    climbHistories: IClimbHistory[];
    currentClimb: WithRequiredOwnership<IClimb> | null;
  }>([...TRAINING_SESSION_POPULATE]);

  if (!session) {
    throw new ResourceNotFound(`Training session with id ${id} not found`);
  }

  return withValidCurrentClimb(withValidClimbHistories(session));
}

/**
 * `owner` is set by the service from the authenticated user; `summary` is a
 * denormalized cache recomputed elsewhere — both excluded for the same
 * reason `source`/`sourceId` are excluded on climb/location/sector.
 * Everything else, including `sport` and `lastActivityAt`, flows through as
 * the model actually requires it (a full PUT replace on update); the mapper
 * is responsible for producing a value even where the API type allows
 * omitting one — see `toUpsertTrainingSessionInput`.
 */
type UpsertTrainingSessionInput = Omit<
  EntityAttributes<ITrainingSession>,
  'owner' | 'summary'
> & { id?: string };

/** Item logs only make sense against a planned session's template. */
async function validatePlanned(
  owner: Types.ObjectId,
  { id, planned, sport, itemLogs }: UpsertTrainingSessionInput
): Promise<void> {
  if (!planned) {
    if (itemLogs.length > 0) {
      throw new ValidationError('Item logs require a planned session');
    }
    return;
  }

  const enrollment = await PlanEnrollment.findOne({
    _id: planned.enrollment,
    owner,
  });
  if (!enrollment) {
    throw new ResourceNotFound(
      `Plan enrollment ${planned.enrollment.toString()} not found`
    );
  }
  // Only new sessions need an active plan; one already in progress must stay
  // stoppable after its plan is abandoned or completed.
  if (!id && enrollment.status !== 'active') {
    throw new ValidationError(
      `Plan enrollment ${enrollment._id.toString()} is ${enrollment.status}`
    );
  }

  const plan = await getTrainingPlanById(enrollment.planId);
  const error = validatePlannedSession(plan, planned, sport, itemLogs);
  if (error) {
    throw new ValidationError(error);
  }
}

async function upsertTrainingSession(
  user: IUser,
  input: UpsertTrainingSessionInput
): Promise<ValidTrainingSession> {
  const { id, ...data } = input;
  const userId = user._id;

  await validatePlanned(userId, input);

  let sessionId: Types.ObjectId;

  if (id) {
    const updated = await TrainingSession.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ResourceNotFound(
        `Training session ${id} not found or not editable`
      );
    }
    sessionId = updated._id;
  } else {
    const now = new Date();
    const created = await TrainingSession.create({
      ...data,
      owner: userId,
      startedAt: now,
      lastActivityAt: now,
    });
    sessionId = created._id;
  }

  // A gym session's summary derives from its own item logs, so every put is
  // a write that touches it.
  if (data.sport === 'gym') {
    await recomputeGymSessionSummary(sessionId);
  }

  return getTrainingSessionById(userId, sessionId.toString());
}

async function deleteTrainingSession(
  owner: Types.ObjectId,
  id: string
): Promise<void> {
  const result = await TrainingSession.deleteOne({ _id: id, owner });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(
      `Training session ${id} not found or not deletable`
    );
  }
}

function computeTrainingSessionSummary(
  histories: { status: ClimbHistoryStatus; climb: IClimb | null }[]
): SessionSummaryData {
  const count = histories.length;
  if (count === 0) {
    return { ...EMPTY_TRAINING_SESSION_SUMMARY };
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
 * Recomputes the denormalized `summary` cache on a training session from its
 * climb histories. Must run after every write that touches the session's
 * derived data (try add/edit/remove, history delete), mirroring the
 * `computeTopStatus`-on-every-write pattern one level up.
 */
async function recomputeTrainingSessionSummary(
  sessionId: Types.ObjectId | string
): Promise<void> {
  const histories = await ClimbHistory.find({
    trainingSession: sessionId,
  }).populate<{ climb: IClimb | null }>('climb');

  const summary = computeTrainingSessionSummary(histories);

  await TrainingSession.updateOne({ _id: sessionId }, { $set: { summary } });
}

function computeGymSessionSummary(
  totalItems: number,
  itemLogs: Pick<TrainingSessionItemLog, 'status'>[]
): SessionSummaryData {
  const done = itemLogs.filter(({ status }) => status === 'done').length;
  return { headline: `${done}/${totalItems} exercises`, count: done };
}

/**
 * Recomputes the `summary` cache of a gym session from its item logs against
 * its planned template. Reads the stored session rather than the put input
 * because an update that omits `planned` keeps the stored one.
 */
async function recomputeGymSessionSummary(
  sessionId: Types.ObjectId
): Promise<void> {
  const session = await TrainingSession.findById(sessionId);
  if (!session) {
    return;
  }

  let totalItems = 0;
  if (session.planned) {
    const { enrollment: enrollmentId, sessionTemplateId } = session.planned;
    const enrollment = await PlanEnrollment.findById(enrollmentId);
    if (enrollment) {
      const plan = await getTrainingPlanById(enrollment.planId);
      totalItems =
        plan.sessionTemplates.find(({ id }) => id === sessionTemplateId)?.items
          .length ?? 0;
    }
  }

  const summary = computeGymSessionSummary(totalItems, session.itemLogs);

  await TrainingSession.updateOne({ _id: sessionId }, { $set: { summary } });
}

export {
  computeTrainingSessionSummary,
  deleteTrainingSession,
  getTrainingSessionById,
  getTrainingSessions,
  recomputeTrainingSessionSummary,
  upsertTrainingSession,
};
export type {
  TrainingSessionsCursor,
  UpsertTrainingSessionInput,
  ValidTrainingSession,
};
