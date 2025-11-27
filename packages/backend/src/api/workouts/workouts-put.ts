import {
  WorkoutsPutRequest,
  WorkoutsPutResponse,
} from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { DbRecord } from '../../services/aws/db-record';
import { WorkoutsService } from '../../services/workouts-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  WorkoutsPutResponse,
  unknown,
  unknown,
  WorkoutsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const workoutPutData = request.body;
  const { userId } = request.user;

  const record: DbRecord<'workout'> = {
    description: workoutPutData.description,
    exercises: workoutPutData.exercises.map<
      DbRecord<'workout'>['exercises'][number]
    >((exercise) => ({
      description: exercise.description,
      intensity: exercise.intensity,
      intensityUnit: exercise.intensityUnit,
      name: exercise.name,
      reps: exercise.reps,
      restBetweenReps: exercise.restBetweenReps,
      restBetweenSets: exercise.restBetweenSets,
      sets: exercise.sets,
      sort: exercise.sort,
    })),
    updatedAt: new Date().toISOString(),
    name: workoutPutData.name,
    PK: 'workout',
    SK:
      (workoutPutData.id as DbRecord<'workout'>['SK']) ??
      WorkoutsService.instance.newSk(userId),
  };
  void (await WorkoutsService.instance.put(record));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        workout: {
          description: record.description,
          exercises: record.exercises,
          id: record.SK,
          name: record.name,
          isFavorite: false,
        },
      },
    },
  };
});

export { handler };
