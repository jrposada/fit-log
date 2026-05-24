import type { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-history/climb-history';

import { toApiDepopulatedClimb } from '../climbs/climbs-mapper.ts';
import { toApiDepopulatedLocation } from '../locations/locations-mapper.ts';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper.ts';
import type { ValidClimbHistory } from './climb-histories-utils.ts';

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

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory };
