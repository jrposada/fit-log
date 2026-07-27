import type { Workout } from '@jrposada/fit-log-shared/models/workout/workout';

import type { IWorkout } from '../../models/workout.ts';

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
