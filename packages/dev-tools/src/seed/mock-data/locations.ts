import { faker } from '@faker-js/faker';

import { DbRecord } from '@backend/aws/db-record';

export function fakeLocation(): DbRecord<'location'> {
  return {
    PK: 'location',
    SK: `location${faker.string.uuid()}` as DbRecord<'location'>['SK'],
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    name: faker.lorem.words({ min: 1, max: 3 }),
  };
}
