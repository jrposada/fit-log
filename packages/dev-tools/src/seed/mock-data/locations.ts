import { faker } from '@faker-js/faker';

import { DbRecord } from '@backend/aws/db-record';

export function fakeLocation(): DbRecord<'location'> {
  return {
    PK: 'location',
    SK: `location#${faker.string.uuid()}` as DbRecord<'location'>['SK'],
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    name: faker.location.city(),
    description: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.7,
    }),
    latitude: faker.helpers.maybe(() => faker.location.latitude(), {
      probability: 0.8,
    }),
    longitude: faker.helpers.maybe(() => faker.location.longitude(), {
      probability: 0.8,
    }),
    address: faker.helpers.maybe(() => faker.location.streetAddress(true), {
      probability: 0.8,
    }),
    placeName: faker.helpers.maybe(() => faker.company.name(), {
      probability: 0.6,
    }),
    placeId: faker.helpers.maybe(() => faker.string.alphanumeric(27), {
      probability: 0.7,
    }),
    lastUsedAt: faker.helpers.maybe(
      () => faker.date.recent({ days: 7 }).toISOString(),
      { probability: 0.5 }
    ),
  };
}
