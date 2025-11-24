import { faker } from '@faker-js/faker';

import { DbRecord } from '@backend/aws/db-record';

const grades = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];

function fakeHold() {
  return {
    x: faker.number.float({ min: 0, max: 1, fractionDigits: 3 }),
    y: faker.number.float({ min: 0, max: 1, fractionDigits: 3 }),
  };
}

export function fakeClimb(
  locations: DbRecord<'location'>[]
): DbRecord<'climb'> {
  const numHolds = faker.number.int({ min: 4, max: 12 });
  const holds = Array.from({ length: numHolds }, () => fakeHold());

  return {
    PK: 'climb',
    SK: `climb#${faker.string.uuid()}` as DbRecord<'climb'>['SK'],
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    location: faker.helpers.arrayElement(locations).SK,
    name: faker.word.words({ count: { min: 1, max: 3 } }),
    grade: faker.helpers.arrayElement(grades),
    description: faker.lorem.paragraph(),
    sector: faker.location.city(),
    holds,
  };
}
