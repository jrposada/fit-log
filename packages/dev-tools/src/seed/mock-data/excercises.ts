import { DbRecord } from '@backend/aws/db-record';
import { faker } from '@faker-js/faker';

export function fakeExercise(): DbRecord<'workout'>['exercises'][number] {
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
