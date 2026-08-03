import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Location } from '@jrposada/fit-log-shared/models/locations/location';
import type { MergeType } from 'mongoose';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { IImage } from '../../data/models/image.ts';
import type { ILocation } from '../../data/models/location.ts';
import type { ISector } from '../../data/models/sector.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiDepopulatedSector } from './sectors.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedLocation(
  model: ILocation
): Omit<WithDepopulatedOwnership<Location>, 'sectors'> & { sectors: string[] } {
  return {
    /* Data */
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* References */
    sectors: model.sectors.map((sector) => sector._id.toString()),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiLocation(
  model: MergeType<
    WithPopulatedOwnership<ILocation>,
    { sectors: MergeType<ISector, { images: IImage[] }>[]; sports?: Sport[] }
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
    sports: model.sports,

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* References */
    sectors: model.sectors.map(toApiDepopulatedSector),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedLocation, toApiLocation };
