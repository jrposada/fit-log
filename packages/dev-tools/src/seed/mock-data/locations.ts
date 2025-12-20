import { faker } from '@faker-js/faker';
import { ILocation } from '@backend/models/location';

export function fakeLocation(): Partial<
  Omit<ILocation, '_id' | 'createdAt' | 'updatedAt'>
> {
  return {
    name: faker.location.city(),
    description: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.7,
    }),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    googleMapsId: faker.helpers.maybe(() => faker.string.alphanumeric(27), {
      probability: 0.7,
    }),
    sectors: [],
  };
}
