import { ClimbHistory } from '@shared/models/climb-history';

import { IClimbHistory } from '../../models/climb-history';

function toApiClimbHistory(model: IClimbHistory): ClimbHistory {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    attempts: model.attempts,
    notes: model.notes,

    /* References */
    climb: model.climb.toString(),
    location: model.location.toString(),
    sector: model.sector.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory };
