import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';
import type {
  TrainingSession,
  TrainingSessionItemLog,
  TrainingSessionPlanned,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { TrainingSessionsPutRequest } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import { Types } from 'mongoose';

import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type {
  ITrainingSession,
  ITrainingSessionPlanned,
  TrainingSessionRequiredRefs,
} from '../../data/models/training-session.ts';
import type {
  UpsertTrainingSessionInput,
  ValidTrainingSession,
} from '../../services/training-session.ts';
import { toApiDepopulatedClimbHistory } from './climb-histories.ts';
import { toApiDepopulatedClimb } from './climbs.ts';
import { toApiDepopulatedLocation } from './locations.ts';

function toApiTrainingSessionPlanned(
  planned: ITrainingSessionPlanned
): TrainingSessionPlanned {
  return {
    enrollment: planned.enrollment.toString(),
    sessionTemplateId: planned.sessionTemplateId,
    week: planned.week,
    day: planned.day,
    slot: planned.slot,
  };
}

function toApiTrainingSessionItemLog(
  itemLog: TrainingSessionItemLog
): TrainingSessionItemLog {
  return {
    itemOrder: itemLog.itemOrder,
    exerciseId: itemLog.exerciseId,
    status: itemLog.status,
    notes: itemLog.notes,
    sets: itemLog.sets.map((set) => ({
      reps: set.reps,
      weightKg: set.weightKg,
      holdS: set.holdS,
      durationMin: set.durationMin,
      rpe: set.rpe,
    })),
  };
}

function toApiDepopulatedTrainingSession(
  model: WithRequiredRefs<ITrainingSession, TrainingSessionRequiredRefs>
): NonNullable<ClimbHistory['trainingSession']> {
  return {
    /* Data */
    id: model._id.toString(),
    sport: model.sport,
    title: model.title,
    notes: model.notes,
    startedAt: model.startedAt.toISOString(),
    endedAt: model.endedAt ? model.endedAt.toISOString() : undefined,
    lastActivityAt: model.lastActivityAt.toISOString(),
    planned: model.planned
      ? toApiTrainingSessionPlanned(model.planned)
      : undefined,
    itemLogs: model.itemLogs.map(toApiTrainingSessionItemLog),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    currentClimb: model.currentClimb
      ? model.currentClimb.toString()
      : undefined,
    location: model.location ? model.location.toString() : undefined,
    climbHistories: model.climbHistories.map((id) => id.toString()),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiTrainingSession(model: ValidTrainingSession): TrainingSession {
  return {
    /* Data */
    id: model._id.toString(),
    sport: model.sport,
    title: model.title,
    notes: model.notes,
    startedAt: model.startedAt.toISOString(),
    endedAt: model.endedAt ? model.endedAt.toISOString() : undefined,
    lastActivityAt: model.lastActivityAt.toISOString(),
    planned: model.planned
      ? toApiTrainingSessionPlanned(model.planned)
      : undefined,
    itemLogs: model.itemLogs.map(toApiTrainingSessionItemLog),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    currentClimb: model.currentClimb
      ? toApiDepopulatedClimb(model.currentClimb)
      : undefined,
    location: model.location
      ? toApiDepopulatedLocation(model.location)
      : undefined,
    climbHistories: model.climbHistories.map(toApiDepopulatedClimbHistory),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toUpsertTrainingSessionInput(
  request: TrainingSessionsPutRequest
): UpsertTrainingSessionInput {
  return {
    /* Data */
    id: request.id,
    sport: request.sport,
    title: request.title,
    notes: request.notes,
    startedAt: new Date(request.startedAt),
    endedAt: request.endedAt ? new Date(request.endedAt) : undefined,
    lastActivityAt: request.lastActivityAt
      ? new Date(request.lastActivityAt)
      : new Date(),
    currentClimb: request.currentClimb
      ? new Types.ObjectId(request.currentClimb)
      : null,
    planned: request.planned
      ? {
          ...request.planned,
          enrollment: new Types.ObjectId(request.planned.enrollment),
        }
      : undefined,
    itemLogs: request.itemLogs ?? [],

    /* References */
    location: request.location ? new Types.ObjectId(request.location) : null,
    climbHistories: request.climbHistories.map((id) => new Types.ObjectId(id)),
  };
}

export {
  toApiDepopulatedTrainingSession,
  toApiTrainingSession,
  toUpsertTrainingSessionInput,
};
