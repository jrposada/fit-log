import { faker } from '@faker-js/faker';
import { IClimb } from '@backend/models/climb';

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

export function fakeClimb(): Partial<
  Omit<
    IClimb,
    '_id' | 'createdAt' | 'updatedAt' | 'location' | 'sector' | 'image'
  >
> {
  const numHolds = faker.number.int({ min: 4, max: 12 });
  const holds = Array.from({ length: numHolds }, () => fakeHold());

  return {
    name: faker.word.words({ count: { min: 1, max: 3 } }),
    grade: faker.helpers.arrayElement(grades),
    description: faker.lorem.paragraph(),
    holds,
  };
}
