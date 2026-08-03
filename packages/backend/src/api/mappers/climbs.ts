import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Climb } from '@jrposada/fit-log-shared/models/climbs/climb';
import type { MergeType } from 'mongoose';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type { ClimbRequiredRefs, IClimb } from '../../data/models/climb.ts';
import type { IImage } from '../../data/models/image.ts';
import type { ILocation } from '../../data/models/location.ts';
import type { IModel3d } from '../../data/models/model-3d.ts';
import type { ISector } from '../../data/models/sector.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiDepopulatedImage } from './images.ts';
import { toApiDepopulatedLocation } from './locations.ts';
import { toApiDepopulatedModel3d } from './model-3ds.ts';
import { toApiDepopulatedSector } from './sectors.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedClimb(
  model: WithRequiredRefs<IClimb, ClimbRequiredRefs>
): Omit<
  WithDepopulatedOwnership<Climb>,
  'image' | 'location' | 'sector' | 'model3d'
> & {
  image: string | null;
  location: string;
  sector: string;
  model3d: string | null;
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
    image: model.image ? model.image._id.toString() : null,
    location: model.location._id.toString(),
    sector: model.sector._id.toString(),
    model3d: model.model3d ? model.model3d._id.toString() : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiClimb(
  model: MergeType<
    WithPopulatedOwnership<IClimb>,
    {
      image: IImage | null;
      location: ILocation;
      sector: MergeType<ISector, { images: IImage[] }>;
      model3d: IModel3d | null;
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
    image: model.image ? toApiDepopulatedImage(model.image) : null,
    location: toApiDepopulatedLocation(model.location),
    sector: toApiDepopulatedSector(model.sector),
    model3d: model.model3d ? toApiDepopulatedModel3d(model.model3d) : null,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimb, toApiDepopulatedClimb };
