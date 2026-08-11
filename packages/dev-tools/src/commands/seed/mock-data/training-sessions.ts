import { faker } from '@faker-js/faker';

export function fakeTrainingSession(): { title: string; notes?: string } {
  return {
    title: faker.lorem.words({ min: 2, max: 4 }),
    notes: faker.datatype.boolean({ probability: 0.5 })
      ? faker.lorem.sentence()
      : undefined,
  };
}
