import { faker } from '@faker-js/faker';
import { IExercise } from '@backend/models/workout';

export function fakeExercise(): IExercise {
  return {
    description: faker.lorem.paragraphs(),
    intensity: faker.number.int(100),
    intensityUnit: faker.helpers.arrayElement([
      'time',
      'weight',
      'body-weight',
    ]),
    name: faker.lorem.words({ min: 1, max: 3 }),
    reps: faker.number.int(20),
    restBetweenReps: faker.number.int({ multipleOf: 15, min: 15, max: 15 * 4 }),
    restBetweenSets: faker.number.int({ multipleOf: 15, min: 60, max: 60 * 5 }),
    sets: faker.number.int(10),
    sort: faker.number.int(100),
  };
}
