import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Sector } from '@jrposada/fit-log-shared/models/sectors/sector';
import type { SectorsPutRequest } from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import { Types } from 'mongoose';

import type { WithDepopulatedRefs } from '../../data/infrastructure/with-depopulated-refs.ts';
import type { WithPopulatedRefs } from '../../data/infrastructure/with-populated-refs.ts';
import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type { WithRequiredOwnership } from '../../data/models/_collaborator.ts';
import type { IImage } from '../../data/models/image.ts';
import type {
  ISector,
  SectorPopulatedRefs,
  SectorRequiredRefs,
} from '../../data/models/sector.ts';
import { hasRequiredRefs } from '../../services/climb.ts';
import type { UpsertSectorInput, ValidSector } from '../../services/sector.ts';
import { toApiDepopulatedClimb } from './climbs.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiDepopulatedImage } from './images.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedSector(
  model: WithPopulatedRefs<
    WithRequiredRefs<WithRequiredOwnership<ISector>, SectorRequiredRefs>,
    'images',
    {
      images: WithRequiredOwnership<IImage>[];
    }
  >
): WithDepopulatedRefs<
  WithDepopulatedOwnership<Sector>,
  Exclude<keyof SectorPopulatedRefs, 'images'>
> {
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

function toApiSector(model: ValidSector): Sector {
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

function toUpsertSectorInput(request: SectorsPutRequest): UpsertSectorInput {
  return {
    /* Data */
    id: request.id,
    name: request.name,
    description: request.description,
    isPrimary: request.isPrimary,
    latitude: request.latitude,
    longitude: request.longitude,
    googleMapsId: request.googleMapsId,

    /* References */
    images: request.images.map((imageId) => new Types.ObjectId(imageId)),
    climbs: request.climbs.map((climbId) => new Types.ObjectId(climbId)),
  };
}

export { toApiDepopulatedSector, toApiSector, toUpsertSectorInput };
