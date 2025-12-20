import { faker } from '@faker-js/faker';
import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { Workout } from '@backend/models/workout';
import { Location } from '@backend/models/location';
import { Sector } from '@backend/models/sector';
import { Climb } from '@backend/models/climb';
import { Image } from '@backend/models/image';

import { Settings } from '../register';
import { fakeClimb } from './mock-data/climbs';
import { fakeWorkout } from './mock-data/workouts';
import { fakeLocation } from './mock-data/locations';
import { fakeImage } from './mock-data/images';
import { fakeSector } from './mock-data/sectors';

type CommandSettings = Settings<{
  numWorkouts: number;
  numClimbs: number;
  numLocations: number;
}>;

const action: CommandSettings['action'] = async ({
  numWorkouts,
  numClimbs,
  numLocations,
}) => {
  try {
    await connectToDatabase();

    // 1. Create Images (prerequisites for climbs)
    console.log(`Creating ${numClimbs} images...`);
    const imagePromises = [];
    for (let i = 0; i < numClimbs; i++) {
      const imageData = fakeImage();
      imagePromises.push(Image.create(imageData));
    }
    const images = await Promise.all(imagePromises);
    console.log(`✓ Created ${images.length} images`);

    // 2. Create Locations
    console.log(`Creating ${numLocations} locations...`);
    const locationPromises = [];
    for (let i = 0; i < numLocations; i++) {
      const locationData = fakeLocation();
      locationPromises.push(Location.create(locationData));
    }
    const locations = await Promise.all(locationPromises);
    console.log(`✓ Created ${locations.length} locations`);

    // 3. Create Sectors (2 per location)
    const sectorsPerLocation = 2;
    console.log(`Creating ${numLocations * sectorsPerLocation} sectors...`);
    const sectorPromises = [];
    for (let i = 0; i < numLocations; i++) {
      for (let j = 0; j < sectorsPerLocation; j++) {
        const sectorData = fakeSector();
        sectorPromises.push(Sector.create(sectorData));
      }
    }
    const sectors = await Promise.all(sectorPromises);
    console.log(`✓ Created ${sectors.length} sectors`);

    // 4. Update locations with sector references
    console.log('Linking sectors to locations...');
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const locationSectors = sectors.slice(
        i * sectorsPerLocation,
        (i + 1) * sectorsPerLocation
      );
      location.sectors = locationSectors.map((s) => s._id);
      await location.save();
    }
    console.log('✓ Linked sectors to locations');

    // 5. Create Climbs
    console.log(`Creating ${numClimbs} climbs...`);
    const climbPromises = [];
    for (let i = 0; i < numClimbs; i++) {
      const randomLocation = faker.helpers.arrayElement(locations);
      const randomSector = faker.helpers.arrayElement(sectors);
      const randomImage = faker.helpers.arrayElement(images);

      const climbData = {
        ...fakeClimb(),
        location: randomLocation._id,
        sector: randomSector._id,
        image: randomImage._id,
      };
      climbPromises.push(Climb.create(climbData));
    }
    const climbs = await Promise.all(climbPromises);
    console.log(`✓ Created ${climbs.length} climbs`);

    // 6. Update sectors with climb and image references
    console.log('Linking climbs and images to sectors...');
    for (const climb of climbs) {
      await Sector.findByIdAndUpdate(climb.sector, {
        $addToSet: { climbs: climb._id, images: climb.image },
      });
    }
    console.log('✓ Linked climbs and images to sectors');

    // 7. Create Workouts
    console.log(`Creating ${numWorkouts} workouts...`);
    const workoutPromises = [];
    for (let i = 0; i < numWorkouts; i++) {
      const workoutData = fakeWorkout();
      workoutPromises.push(Workout.create(workoutData));
    }
    const workouts = await Promise.all(workoutPromises);
    console.log(`✓ Created ${workouts.length} workouts`);

    console.log('✓ Database seeded successfully!');
  } finally {
    await disconnectFromDatabase();
  }
};

const seedCommand: CommandSettings = {
  name: 'seed',
  description: 'Seed DB with mock data',
  action,
  options: [
    {
      flags: '--num-workouts <value>',
      description: 'Number of workouts to create',
      type: 'number',
      defaultValue: 100,
    },
    {
      flags: '--num-climbs <value>',
      description: 'Number of climbs to create',
      type: 'number',
      defaultValue: 250,
    },
    {
      flags: '--num-locations <value>',
      description: 'Number of locations to create',
      type: 'number',
      defaultValue: 50,
    },
  ],
};

export default seedCommand;
