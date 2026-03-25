import { faker } from '@faker-js/faker';
import { IWorkout } from '@backend/models/workout';
import { fakeExercise } from './exercises';

export function fakeWorkout(): Partial<
  Omit<IWorkout, '_id' | 'createdAt' | 'updatedAt'>
> {
  return {
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.paragraph(),
    exercises: new Array(faker.number.int(10))
      .fill({})
      .map(() => fakeExercise()),
  };
}
