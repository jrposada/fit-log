import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IClimbHistory } from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiDepopulatedClimb } from '../climbs/climbs-mapper';
import { toApiDepopulatedLocation } from '../locations/locations-mapper';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';

function toApiClimbHistory(
  model: MergeType<
    IClimbHistory,
    {
      climb: IClimb;
      location: ILocation;
      sector: MergeType<ISector, { images: IImage[] }>;
    }
  >
): ClimbHistory {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    attempts: model.attempts,
    notes: model.notes,

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
