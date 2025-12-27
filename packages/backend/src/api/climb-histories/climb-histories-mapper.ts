import { ClimbHistory } from '@shared/models/climb-history';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IClimbHistory } from '../../models/climb-history';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiClimb } from '../climbs/climbs-mapper';
import { toApiLocation } from '../locations/locations-mapper';
import { toApiSector } from '../sectors/sectors-mapper';

function toApiClimbHistory(
  model: MergeType<
    IClimbHistory,
    { climb: IClimb; location: ILocation; sector: ISector }
  >
): ClimbHistory {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    attempts: model.attempts,
    notes: model.notes,

    /* References */
    climb: toApiClimb(model.climb),
    location: toApiLocation(model.location),
    sector: toApiSector(model.sector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimbHistory };
