import { faker } from '@faker-js/faker';
import {
  ClimbHistoryStatus,
  IClimbHistoryTry,
  STATUS_LIST,
  STATUS_PRIORITY,
} from '@backend/models/climb-history';

function fakeTry(): IClimbHistoryTry {
  const status = faker.helpers.arrayElement(STATUS_LIST);

  const attempts =
    status === 'flash' ? undefined : faker.number.int({ min: 1, max: 10 });

  const notes = faker.datatype.boolean({ probability: 0.7 })
    ? faker.lorem.sentence()
    : undefined;

  return {
    status,
    attempts,
    notes,
    date: faker.date.recent({ days: 90 }),
  };
}

export function fakeClimbHistory(): {
  status: ClimbHistoryStatus;
  tries: IClimbHistoryTry[];
} {
  const numTries = faker.number.int({ min: 1, max: 5 });
  const tries = Array.from({ length: numTries }, () => fakeTry());

  // Sort tries by date ascending
  tries.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Compute top-level status from highest priority try
  let bestStatus: ClimbHistoryStatus = tries[0].status;
  for (const t of tries) {
    if (STATUS_PRIORITY[t.status] > STATUS_PRIORITY[bestStatus]) {
      bestStatus = t.status;
    }
  }

  return {
    status: bestStatus,
    tries,
  };
}
