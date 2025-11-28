import { Sector } from '@shared/models/sector';

import { ISector } from '../../models/sector';

function toApiSector(model: ISector): Sector {
  return {
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    isPrimary: model.isPrimary,

    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    climbs: model.climbs.map((climbId) => climbId.toString()),
    images: model.images.map((imageId) => imageId.toString()),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiSector };
