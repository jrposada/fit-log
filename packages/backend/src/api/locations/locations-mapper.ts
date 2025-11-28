import { Location } from '@shared/models/location';

import { ILocation } from '../../models/location';

function toApiLocation(model: ILocation): Location {
  return {
    id: model._id.toString(),
    name: model.name,
    description: model.description,

    latitude: model.latitude,
    longitude: model.longitude,
    googleMapsId: model.googleMapsId,

    sectors: model.sectors.map((sectorId) => sectorId.toString()),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiLocation };
