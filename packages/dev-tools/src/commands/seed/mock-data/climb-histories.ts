import { faker } from '@faker-js/faker';
import { IClimbHistory } from '@backend/models/climb-history';

const statuses: IClimbHistory['status'][] = [
  'send',
  'flash',
  'attempt',
  'project',
];

export function fakeClimbHistory(): Partial<
  Omit<IClimbHistory, '_id' | 'createdAt' | 'updatedAt' | 'climb' | 'location' | 'sector'>
> {
  const status = faker.helpers.arrayElement(statuses);

  // Only add attempts for non-flash statuses
  const attempts = status === 'flash'
    ? undefined
    : faker.number.int({ min: 1, max: 10 });

  // 70% chance of having notes
  const notes = faker.datatype.boolean({ probability: 0.7 })
    ? faker.lorem.sentence()
    : undefined;

  return {
    status,
    attempts,
    notes,
  };
}
