import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';

import type { WithDepopulatedRefs } from '../../data/infrastructure/with-depopulated-refs.ts';
import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type {
  ClimbHistoryRefs,
  ClimbHistoryRequiredRefs,
  IClimbHistory,
} from '../../data/models/climb-history.ts';
import type { ValidClimbHistory } from '../../services/climb-history.ts';
import { toApiDepopulatedClimb } from './climbs.ts';
import { toApiDepopulatedLocation } from './locations.ts';
import { toApiDepopulatedSector } from './sectors.ts';
import { toApiDepopulatedTrainingSession } from './training-sessions.ts';

function toApiDepopulatedClimbHistory(
  model: WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs>
): WithDepopulatedRefs<ClimbHistory, ClimbHistoryRefs> {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    isProject: model.isProject,
    tries: model.tries.map((t) => ({
      id: t._id.toString(),
      status: t.status,
      attempts: t.attempts,
      notes: t.notes,
      date: t.date.toISOString(),
    })),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    climb: model.climb.toString(),
    location: model.location.toString(),
    sector: model.sector.toString(),
    trainingSession: model.trainingSession
      ? model.trainingSession.toString()
      : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiClimbHistory(model: ValidClimbHistory): ClimbHistory {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    isProject: model.isProject,
    tries: model.tries.map((t) => ({
      id: t._id.toString(),
      status: t.status,
      attempts: t.attempts,
      notes: t.notes,
      date: t.date.toISOString(),
    })),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    climb: toApiDepopulatedClimb(model.climb),
    location: toApiDepopulatedLocation(model.location),
    sector: toApiDepopulatedSector(model.sector),
    trainingSession: model.trainingSession
      ? toApiDepopulatedTrainingSession(model.trainingSession)
      : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory, toApiDepopulatedClimbHistory };
