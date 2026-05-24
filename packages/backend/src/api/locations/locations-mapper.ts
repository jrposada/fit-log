import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Location } from '@shared/models/location/location';
import { MergeType } from 'mongoose';

import { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import { IImage } from '../../models/image.ts';
import { ILocation } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper.ts';
import { toApiUserSummary } from '../auth/user-summary-mapper.ts';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper.ts';

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
    { sectors: MergeType<ISector, { images: IImage[] }>[] }
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
