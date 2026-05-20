import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Sector } from '@shared/models/sector/sector';
import { MergeType } from 'mongoose';

import { WithPopulatedOwnership } from '../../auth/ownership-populate';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper';
import { toApiUserSummary } from '../auth/user-summary-mapper';
import {
  hasRequiredRefs,
  toApiDepopulatedClimb,
} from '../climbs/climbs-mapper';
import { toApiDepopulatedImage } from '../images/images-mapper';
import { toApiDepopulatedModel3D } from '../models3d/models3d-mapper';

function toApiDepopulatedSector(
  model: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>
): Omit<WithDepopulatedOwnership<Sector>, 'climbs'> & { climbs: string[] } {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    isPrimary: model.isPrimary,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* References */
    climbs: model.climbs.map((climb) => climb._id.toString()),
    images: model.images.map(toApiDepopulatedImage),
    models3d: model.models3d.map(toApiDepopulatedModel3D),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiSector(
  model: MergeType<
    WithPopulatedOwnership<ISector>,
    { climbs: IClimb[]; images: IImage[]; models3d: IModel3D[] }
  >
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

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* References */
    climbs: model.climbs.flatMap((c) =>
      hasRequiredRefs(c) ? [toApiDepopulatedClimb(c)] : []
    ),
    images: model.images.map(toApiDepopulatedImage),
    models3d: model.models3d.map(toApiDepopulatedModel3D),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedSector, toApiSector };
