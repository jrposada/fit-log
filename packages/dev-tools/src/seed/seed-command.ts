import { DynamoDBHelper } from '@backend/aws/dynamodb';
import { assert } from '@shared/utils/assert';

import { Settings } from '../register';
import { fakeClimb } from './mock-data/climbs';
import { fakeWorkout } from './mock-data/workouts';

type CommandSettings = Settings<
  string,
  { numWorkouts: number; numClimbs: number }
>;

const action: CommandSettings['action'] = async (
  userId,
  { numWorkouts, numClimbs }
) => {
  assert(process.env.TABLE_NAME, {
    msg: 'Expected env variable `TABLE_NAME` to be defined',
  });
  const db = new DynamoDBHelper(process.env.TABLE_NAME);

  const promises = [];

  // Create workouts
  for (let i = 0; i < numWorkouts; i += 1) {
    const workout = fakeWorkout(userId);
    console.log(`Workout created ${workout.SK}`);
    promises.push(db.put(workout));
  }

  // Create climbs
  for (let i = 0; i < numClimbs; i += 1) {
    const climb = fakeClimb(userId);
    console.log(`Climb created ${climb.SK}`);
    promises.push(db.put(climb));
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
    {
      flags: '--num-climbs <value>',
      description: 'Number of climbs to create',
      type: 'number',
    },
  ],
};

export default seedCommand;
