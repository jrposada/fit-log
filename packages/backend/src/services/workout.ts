import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IWorkout } from '../models/workout.ts';
import { Workout } from '../models/workout.ts';
import { upsertDocument } from '../utils/upsert-document.ts';

type GetWorkoutsOptions = {
  limit?: number;
};

async function getWorkouts(options: GetWorkoutsOptions): Promise<IWorkout[]> {
  const { limit } = options;

  const query = Workout.find();

  if (limit) {
    query.limit(limit);
  }

  return query.exec();
}

async function getWorkoutById(id: string): Promise<IWorkout> {
  const workout = await Workout.findById(id);

  if (!workout) {
    throw new ResourceNotFound(`Workout with id ${id} not found`);
  }

  return workout;
}

type UpsertWorkoutInput = {
  id?: string;
  name: string;
  description: string;
  exercises: IWorkout['exercises'];
};

async function upsertWorkout(input: UpsertWorkoutInput): Promise<IWorkout> {
  return upsertDocument(Workout, input.id, {
    name: input.name,
    description: input.description,
    exercises: input.exercises,
  });
}

async function deleteWorkout(id: string): Promise<void> {
  await Workout.deleteOne({ _id: id });
}

export { deleteWorkout, getWorkoutById, getWorkouts, upsertWorkout };
