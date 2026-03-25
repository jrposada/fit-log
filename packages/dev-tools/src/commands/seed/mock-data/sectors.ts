import { faker } from '@faker-js/faker';
import { ISector } from '@backend/models/sector';

export function fakeSector(): Partial<
  Omit<ISector, '_id' | 'createdAt' | 'updatedAt'>
> {
  return {
    name: faker.helpers.arrayElement([
      'Main Wall',
      'Cave',
      'Overhang',
      'Slab',
      'Roof',
    ]),
    description: faker.lorem.sentence(),
    isPrimary: faker.datatype.boolean({ probability: 0.3 }),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    googleMapsId: faker.helpers.maybe(() => faker.string.alphanumeric(27), {
      probability: 0.7,
    }),
    images: [],
    climbs: [],
  };
}
