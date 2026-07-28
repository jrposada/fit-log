import { Types } from 'mongoose';

import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IWorkout } from '../models/workout.ts';
import { Workout } from '../models/workout.ts';
import { upsertDocument } from '../utils/upsert-document.ts';

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the workouts list, in decoded (plain JSON) form. */
type WorkoutsCursor = { createdAt: string; id: string };

type GetWorkoutsOptions = {
  limit?: number;
  cursor?: WorkoutsCursor | null;
};

async function getWorkouts(
  options: GetWorkoutsOptions
): Promise<{ workouts: IWorkout[]; nextCursor: WorkoutsCursor | null }> {
  const { limit, cursor } = options;

  const filter: Record<string, unknown> = {};
  if (cursor) {
    const cursorDate = new Date(cursor.createdAt);
    const cursorId = new Types.ObjectId(cursor.id);
    filter.$or = [
      { createdAt: { $lt: cursorDate } },
      { createdAt: cursorDate, _id: { $lt: cursorId } },
    ];
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const workouts = await Workout.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize + 1);

  const hasMore = workouts.length > pageSize;
  const pageWorkouts = hasMore ? workouts.slice(0, pageSize) : workouts;

  const last = pageWorkouts[pageWorkouts.length - 1];
  const nextCursor =
    hasMore && last
      ? { createdAt: last.createdAt.toISOString(), id: last._id.toString() }
      : null;

  return { workouts: pageWorkouts, nextCursor };
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
export type { WorkoutsCursor };
