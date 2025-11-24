import { DynamoDBHelper } from '@backend/aws/dynamodb';
import { assert } from '@shared/utils/assert';

import { Settings } from '../register';
import { fakeClimb } from './mock-data/climbs';
import { fakeWorkout } from './mock-data/workouts';
import { fakeLocation } from './mock-data/locations';

type CommandSettings = Settings<
  string,
  { numWorkouts: number; numClimbs: number; numLocations: number }
>;

const action: CommandSettings['action'] = async (
  userId,
  { numWorkouts, numClimbs, numLocations }
) => {
  assert(process.env.TABLE_NAME, {
    msg: 'Expected env variable `TABLE_NAME` to be defined',
  });
  const db = new DynamoDBHelper(process.env.TABLE_NAME);

  // Create workouts
  const workoutPromises = [];
  for (let i = 0; i < numWorkouts; i += 1) {
    const workout = fakeWorkout(userId);
    console.log(`Workout created ${workout.SK}`);
    workoutPromises.push(db.put(workout));
  }
  await Promise.all(workoutPromises);

  // Create locations
  const locationPromises = [];
  for (let i = 0; i < numLocations; i += 1) {
    const location = fakeLocation();
    console.log(`Location created ${location.SK}`);
    locationPromises.push(db.put(location));
  }
  const locations = await Promise.all(locationPromises);

  // Create climbs
  const climbPromises = [];
  for (let i = 0; i < numClimbs; i += 1) {
    const climb = fakeClimb(locations);
    console.log(`Climb created ${climb.SK}`);
    climbPromises.push(db.put(climb));
  }
  await Promise.all(climbPromises);
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
    {
      flags: '--num-locations <value>',
      description: 'Number of locations to create',
      type: 'number',
    },
  ],
};

export default seedCommand;
