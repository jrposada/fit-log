import { Workout } from '@shared/models/workout/workout';

import { IWorkout } from '../../models/workout';

function toApiWorkout(model: IWorkout): Workout {
  return {
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    exercises: model.exercises,
    isFavorite: false,
  };
}

export { toApiWorkout };
