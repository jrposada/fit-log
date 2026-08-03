import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Climb } from '@jrposada/fit-log-shared/models/climbs/climb';
import type { MergeType } from 'mongoose';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type { IClimb } from '../../data/models/climb.ts';
import type { IImage } from '../../data/models/image.ts';
import type { ILocation } from '../../data/models/location.ts';
import type { ISector } from '../../data/models/sector.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiDepopulatedImage } from './images.ts';
import { toApiDepopulatedLocation } from './locations.ts';
import { toApiDepopulatedSector } from './sectors.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedClimb(model: WithRequiredRefs<IClimb>): Omit<
  WithDepopulatedOwnership<Climb>,
  'image' | 'location' | 'sector'
> & {
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

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* References */
    image: model.image._id.toString(),
    location: model.location._id.toString(),
    sector: model.sector._id.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiClimb(
  model: MergeType<
    WithPopulatedOwnership<IClimb>,
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

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* References */
    image: toApiDepopulatedImage(model.image),
    location: toApiDepopulatedLocation(model.location),
    sector: toApiDepopulatedSector(model.sector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimb, toApiDepopulatedClimb };
