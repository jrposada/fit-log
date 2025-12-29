import { Sector } from '@shared/models/sector/sector';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ISector } from '../../models/sector';
import { toApiDepopulatedClimb } from '../climbs/climbs-mapper';
import { toApiImage } from '../images/images-mapper';

function toApiDepopulatedSector(
  model: MergeType<ISector, { images: IImage[] }>
): Omit<Sector, 'climbs'> & { climbs: string[] } {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    isPrimary: model.isPrimary,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* References */
    climbs: model.climbs.map((climb) => climb._id.toString()),
    images: model.images.map(toApiImage),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiSector(
  model: MergeType<ISector, { climbs: IClimb[]; images: IImage[] }>
): Sector {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    isPrimary: model.isPrimary,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* References */
    climbs: model.climbs.map(toApiDepopulatedClimb),
    images: model.images.map(toApiImage),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedSector, toApiSector };
