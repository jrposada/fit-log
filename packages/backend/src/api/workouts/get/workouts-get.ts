import { Workout, WorkoutsGetResponse } from '@shared/models/workout';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';
import mockResponse from './workouts-get.json';

export const handler = apiHandler<WorkoutsGetResponse>(async (_event) => {
  const { items, lastEvaluatedKey } = await WorkoutsService.instance.getAll();

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: {
        lastEvaluatedKey,
        workouts: items.map<Workout>((item) => ({
          description: item.description,
          exercises: item.exercises.map((exercise) => ({
            intensity: exercise.intensity,
            intensityUnit: exercise.intensityUnit,
            reps: exercise.reps,
            restBetweenReps: exercise.restBetweenReps,
            restBetweenSets: exercise.restBetweenSets,
            sets: exercise.sets,
          })),
          id: item.PK,
          name: item.name,
        })),
      },
    },
  });
}, mockResponse);
