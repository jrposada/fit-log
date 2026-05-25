import { faker } from '@faker-js/faker';
import { IClimb } from '@backend/models/climb';
import {
  GRADE_OPTIONS,
  HOLD_TYPES,
} from '@jrposada/fit-log-shared/models/climbs/climb';

function fakeHold() {
  return {
    x: faker.number.float({ min: 0, max: 1, fractionDigits: 3 }),
    y: faker.number.float({ min: 0, max: 1, fractionDigits: 3 }),
    radius: faker.number.float({ min: 0.01, max: 0.06, fractionDigits: 3 }),
    type: faker.helpers.arrayElement(HOLD_TYPES),
  };
}

function fakeSplinePoint() {
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

  const spline = faker.datatype.boolean()
    ? Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () =>
        fakeSplinePoint()
      )
    : [];

  return {
    name: faker.word.words({ count: { min: 1, max: 3 } }),
    grade: faker.helpers.arrayElement(GRADE_OPTIONS),
    description: faker.lorem.paragraph(),
    source: 'user',
    holds,
    spline,
  };
}
