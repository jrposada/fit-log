import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IClimbHistory } from '../../models/climb-history';
import { toApiClimb } from '../climbs/climbs-mapper';

function toApiClimbHistory(
  model: MergeType<IClimbHistory, { climb: IClimb }>
): ClimbHistory {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    attempts: model.attempts,
    notes: model.notes,

    /* References */
    climb: toApiClimb(model.climb),
    location: model.location._id.toString(),
    sector: model.sector._id.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory };
