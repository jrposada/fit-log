import { faker } from '@faker-js/faker';

import { DbRecord } from '@backend/aws/db-record';
import { fakeExercise } from './excercises';

export function fakeWorkout(userId: string): DbRecord<'workout'> {
  return {
    PK: 'workout',
    SK: `workout#${userId}#${faker.string.uuid()}` as DbRecord<'workout'>['SK'],
    lastUpdated: faker.date.recent().toISOString(),
    name: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.paragraph(),
    exercises: new Array(faker.number.int(10))
      .fill({})
      .map(() => fakeExercise()),
  };
}
