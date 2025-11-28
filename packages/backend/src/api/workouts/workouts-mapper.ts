import { Workout } from '@shared/models/workout';

import { IWorkout } from '../../models/workout';

function toApiWorkout(model: IWorkout): Workout {
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

export { toApiWorkout };
