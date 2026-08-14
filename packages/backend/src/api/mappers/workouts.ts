import type { Workout } from '@jrposada/fit-log-shared/models/workout/workout';
import type { WorkoutsPutRequest } from '@jrposada/fit-log-shared/models/workout/workout-put';

import type { IWorkout } from '../../data/models/workout.ts';
import type { UpsertWorkoutInput } from '../../services/workout.ts';

function toApiWorkout(model: IWorkout): Workout {
  return {
    id: model._id.toString(),
    name: model.name,
    description: model.description,
    exercises: model.exercises,
    isFavorite: false,
  };
}

function toUpsertWorkoutInput(request: WorkoutsPutRequest): UpsertWorkoutInput {
  return {
    id: request.id,
    name: request.name,
    description: request.description,
    exercises: request.exercises,
  };
}

export { toApiWorkout, toUpsertWorkoutInput };
