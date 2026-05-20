import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Location } from '@shared/models/location/location';
import { MergeType } from 'mongoose';

import { WithPopulatedOwnership } from '../../auth/ownership-populate';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper';
import { toApiUserSummary } from '../auth/user-summary-mapper';
import { toApiDepopulatedSector } from '../sectors/sectors-mapper';

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
    {
      sectors: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>[];
    }
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
