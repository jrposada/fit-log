import { Climb } from '@shared/models/climb';

import { IClimb } from '../../models/climb';

function toApiClimb(model: IClimb): Climb {
  return {
    id: model._id.toString(),
    name: model.name,
    grade: model.grade,
    description: model.description,
    holds: model.holds,

    image: model.image._id.toString(),
    location: model.location._id.toString(),
    sector: model.sector.id.toString(),

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiClimb };
