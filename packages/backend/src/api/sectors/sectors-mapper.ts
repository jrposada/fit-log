import { Sector } from '@shared/models/sector';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ISector } from '../../models/sector';
import { toApiClimb } from '../climbs/climbs-mapper';
import { toApiImage } from '../images/images-mapper';

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
    climbs: model.climbs.map(toApiClimb),
    images: model.images.map(toApiImage),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiSector };
