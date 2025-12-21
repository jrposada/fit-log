import { Location } from '@shared/models/location';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiSector } from '../sectors/sectors-mapper';

function toApiLocation(
  model: MergeType<
    ILocation,
    { sectors: MergeType<ISector, { climbs: IClimb[]; images: IImage[] }>[] }
  >
): Location {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* References */
    sectors: model.sectors.map(toApiSector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiLocation };
