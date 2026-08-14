import { Types } from 'mongoose';

import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import { upsertDocument } from '../data/infrastructure/upsert-document.ts';
import type { IWorkout } from '../data/models/workout.ts';
import { Workout } from '../data/models/workout.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';

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

type UpsertWorkoutInput = EntityAttributes<IWorkout> & { id?: string };

async function upsertWorkout(input: UpsertWorkoutInput): Promise<IWorkout> {
  const { id, ...data } = input;

  const workout = await upsertDocument(Workout, id, data);

  if (!workout) {
    throw new ResourceNotFound(`Workout ${id ?? ''} not found`);
  }

  return workout;
}

async function deleteWorkout(id: string): Promise<void> {
  const result = await Workout.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Workout with id ${id} not found`);
  }
}

export { deleteWorkout, getWorkoutById, getWorkouts, upsertWorkout };
export type { UpsertWorkoutInput, WorkoutsCursor };
