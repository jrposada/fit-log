import { Climb } from '@shared/models/climb';

import { IClimb } from '../../models/climb';

function toApiClimb(model: IClimb): Climb {
  return {
    id: model._id.toString(),
    name: model.name,
    grade: model.grade,
    description: model.description,
    holds: model.holds,

    image: model.image.toString(),
    location: model.location.toString(),
    sector: model.sector.toString(),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimb };
