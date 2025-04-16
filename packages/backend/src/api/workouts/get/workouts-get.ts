import { Exercise, Workout, WorkoutsGetResponse } from '@shared/models/workout';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsGetResponse>(async () => {
  const { items, lastEvaluatedKey } = await WorkoutsService.instance.getAll();

  return Promise.resolve({
    statusCode: 200,
    body: {
      success: true,
      data: {
        lastEvaluatedKey,
        workouts: items.map<Workout>((item) => ({
          description: item.description,
          exercises: item.exercises.map<Exercise>((exercise) => ({
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
          id: item.SK,
          name: item.name,
        })),
      },
    },
  });
});
