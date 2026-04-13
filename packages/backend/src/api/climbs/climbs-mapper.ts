import { Climb } from '@shared/models/climb/climb';
import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { WithRequiredRefs } from '../../utils/types';
import { toApiImage } from '../images/images-mapper';
import { toApiDepopulatedLocation } from '../locations/locations-mapper';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';

function toApiClimb(
  model: MergeType<
    IClimb,
    {
      image: IImage;
      location: ILocation;
      sector: MergeType<ISector, { images: IImage[] }>;
    }
  >
): Climb {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    grade: model.grade,
    description: model.description,
    holds: model.holds,
    spline: model.spline,

    /* References */
    image: toApiImage(model.image),
    location: toApiDepopulatedLocation(model.location),
    sector: toApiDepopulatedSector(model.sector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function hasRequiredRefs(model: IClimb): model is WithRequiredRefs<IClimb> {
  return model.image != null && model.location != null && model.sector != null;
}

function toApiDepopulatedClimb(
  model: WithRequiredRefs<IClimb>
): Omit<Climb, 'image' | 'location' | 'sector'> & {
  image: string;
  location: string;
  sector: string;
} {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    grade: model.grade,
    description: model.description,
    holds: model.holds,
    spline: model.spline,

    /* References */
    image: model.image._id.toString(),
    location: model.location._id.toString(),
    sector: model.sector._id.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { hasRequiredRefs, toApiClimb, toApiDepopulatedClimb };
