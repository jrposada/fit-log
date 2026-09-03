import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';
import type { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { TrainingSessionsPutRequest } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import { Types } from 'mongoose';

import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type {
  ITrainingSession,
  TrainingSessionRequiredRefs,
} from '../../data/models/training-session.ts';
import type {
  UpsertTrainingSessionInput,
  ValidTrainingSession,
} from '../../services/training-session.ts';
import { toApiDepopulatedClimbHistory } from './climb-histories.ts';
import { toApiDepopulatedLocation } from './locations.ts';

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

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
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

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
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
    sport: 'climbing',
    title: request.title,
    notes: request.notes,
    startedAt: new Date(request.startedAt),
    endedAt: request.endedAt ? new Date(request.endedAt) : undefined,
    lastActivityAt: request.lastActivityAt
      ? new Date(request.lastActivityAt)
      : new Date(),

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
