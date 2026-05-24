import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Sector } from '@shared/models/sector/sector';
import { MergeType } from 'mongoose';

import { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import { IClimb } from '../../models/climb.ts';
import { IImage } from '../../models/image.ts';
import { ISector } from '../../models/sector.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper.ts';
import { toApiUserSummary } from '../auth/user-summary-mapper.ts';
import {
  hasRequiredRefs,
  toApiDepopulatedClimb,
} from '../climbs/climbs-mapper.ts';
import { toApiDepopulatedImage } from '../images/images-mapper.ts';

function toApiDepopulatedSector(
  model: MergeType<ISector, { images: IImage[] }>
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

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiSector(
  model: MergeType<
    WithPopulatedOwnership<ISector>,
    { climbs: IClimb[]; images: IImage[] }
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

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedSector, toApiSector };
