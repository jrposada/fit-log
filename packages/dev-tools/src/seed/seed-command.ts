import { DynamoDBHelper } from '@backend/aws/dynamodb';
import { assert } from '@shared/utils/assert';

import { Settings } from '../register';
import { fakeWorkout } from './mock-data/workouts';

type CommandSettings = Settings<string, { numWorkouts: number }>;

const action: CommandSettings['action'] = async (userId, { numWorkouts }) => {
  assert(process.env.TABLE_NAME, {
    msg: 'Expected env variable `TABLE_NAME` to be defined',
  });
  const db = new DynamoDBHelper(process.env.TABLE_NAME);

  const promises = [];
  for (let i = 0; i < numWorkouts; i += 1) {
    const workout = fakeWorkout(userId);
    console.log(`Workout created ${workout.SK}`);
    promises.push(db.put(workout));
  }

  await Promise.all(promises);
};

const seedCommand: CommandSettings = {
  name: 'seed',
  description: 'Seed DB with mock data',
  action,
  arguments: [{ name: '<user-id>', description: 'User ID to seed' }],
  options: [
    {
      flags: '--num-workouts <value>',
      description: 'Number of workouts to create',
      type: 'number',
    },
  ],
};

export default seedCommand;
