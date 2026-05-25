import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';
import type { MergeType } from 'mongoose';

import type { IClimbHistory } from '../../models/climb-history.ts';
import { toApiDepopulatedClimb } from '../climbs/climbs-mapper.ts';
import { toApiDepopulatedLocation } from '../locations/locations-mapper.ts';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper.ts';
import { toApiDepopulatedTrainingSession } from '../training-sessions/training-sessions-mapper.ts';
import type {
  ValidClimbHistory,
  ValidClimbHistoryRefs,
} from './climb-histories-utils.ts';

function toApiDepopulatedClimbHistory(
  model: MergeType<IClimbHistory, ValidClimbHistoryRefs>
): Omit<ClimbHistory, 'climb' | 'location' | 'sector' | 'trainingSession'> & {
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
    trainingSession: model.trainingSession
      ? toApiDepopulatedTrainingSession(model.trainingSession)
      : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory, toApiDepopulatedClimbHistory };
