import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';
import type { MergeType } from 'mongoose';

import type { IClimbHistory } from '../../data/models/climb-history.ts';
import type {
  ValidClimbHistory,
  ValidClimbHistoryRefs,
} from '../../services/climb-history.ts';
import { toApiDepopulatedClimbingSession } from './climbing-sessions.ts';
import { toApiDepopulatedClimb } from './climbs.ts';
import { toApiDepopulatedLocation } from './locations.ts';
import { toApiDepopulatedSector } from './sectors.ts';

function toApiDepopulatedClimbHistory(
  model: MergeType<IClimbHistory, ValidClimbHistoryRefs>
): Omit<ClimbHistory, 'climb' | 'location' | 'sector' | 'climbingSession'> & {
  climb: string;
  location: string;
  sector: string;
} {
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
    climbingSession: model.climbingSession
      ? toApiDepopulatedClimbingSession(model.climbingSession)
      : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory, toApiDepopulatedClimbHistory };
