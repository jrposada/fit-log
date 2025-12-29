import { Location } from '@shared/models/location/location';
import { MergeType } from 'mongoose';

import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';

function toApiDepopulatedLocation(
  model: ILocation
): Omit<Location, 'sectors'> & { sectors: string[] } {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* References */
    sectors: model.sectors.map((sector) => sector._id.toString()),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiLocation(
  model: MergeType<
    ILocation,
    { sectors: MergeType<ISector, { images: IImage[] }>[] }
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
    sectors: model.sectors.map(toApiDepopulatedSector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedLocation, toApiLocation };
