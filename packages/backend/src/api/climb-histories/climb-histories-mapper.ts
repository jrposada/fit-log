import { ClimbHistory } from '@shared/models/climb-history/climb-history';

import { toApiDepopulatedClimb } from '../climbs/climbs-mapper';
import { toApiDepopulatedLocation } from '../locations/locations-mapper';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';
import { ValidClimbHistory } from './climb-histories-utils';

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
