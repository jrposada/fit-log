import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Climb } from '@shared/models/climb/climb';
import { MergeType } from 'mongoose';

import { WithPopulatedOwnership } from '../../auth/ownership-populate';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import { WithRequiredRefs } from '../../utils/types';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper';
import { toApiUserSummary } from '../auth/user-summary-mapper';
import { toApiDepopulatedImage } from '../images/images-mapper';
import { toApiDepopulatedLocation } from '../locations/locations-mapper';
import { toApiDepopulatedModel3D } from '../models3d/models3d-mapper';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';

function toApiDepopulatedClimb(model: WithRequiredRefs<IClimb>): Omit<
  WithDepopulatedOwnership<Climb>,
  'image' | 'location' | 'model3d' | 'sector'
> & {
  image: string;
  location: string;
  model3d?: string;
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
    model3d: model.model3d?.toString(),
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
      model3d?: IModel3D;
      image: IImage;
      location: ILocation;
      sector: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>;
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
    model3d: model.model3d ? toApiDepopulatedModel3D(model.model3d) : undefined,
    image: toApiDepopulatedImage(model.image),
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

export { hasRequiredRefs, toApiClimb, toApiDepopulatedClimb };
