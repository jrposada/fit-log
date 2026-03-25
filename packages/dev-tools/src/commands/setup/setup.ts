import type { Command } from 'commander';
import { faker } from '@faker-js/faker';
import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { Workout } from '@backend/models/workout';
import { Location } from '@backend/models/location';
import { Sector } from '@backend/models/sector';
import { Climb } from '@backend/models/climb';
import { ClimbHistory } from '@backend/models/climb-history';
import { Image } from '@backend/models/image';

import { fakeClimb } from '../seed/mock-data/climbs';
import { fakeClimbHistory } from '../seed/mock-data/climb-histories';
import { fakeWorkout } from '../seed/mock-data/workouts';
import { fakeLocation } from '../seed/mock-data/locations';
import { fakeImage } from '../seed/mock-data/images';
import { fakeSector } from '../seed/mock-data/sectors';

export function registerSetupCommand(setupCmd: Command): void {
  setupCmd
    .command('data')
    .description('Seed DB with mock data')
    .option('--num-workouts <value>', 'Number of workouts to create', '100')
    .option('--num-climbs <value>', 'Number of climbs to create', '250')
    .option(
      '--num-climb-histories <value>',
      'Number of climb histories to create',
      '500'
    )
    .option('--num-locations <value>', 'Number of locations to create', '50')
    .action(
      async (options: {
        numWorkouts: string;
        numClimbs: string;
        numClimbHistories: string;
        numLocations: string;
      }) => {
        const numWorkouts = parseInt(options.numWorkouts);
        const numClimbs = parseInt(options.numClimbs);
        const numClimbHistories = parseInt(options.numClimbHistories);
        const numLocations = parseInt(options.numLocations);

        try {
          await connectToDatabase();

          console.log(`Creating ${numClimbs} images...`);
          const imagePromises = [];
          for (let i = 0; i < numClimbs; i++) {
            const imageData = fakeImage();
            imagePromises.push(Image.create(imageData));
          }
          const images = await Promise.all(imagePromises);
          console.log(`✓ Created ${images.length} images`);

          console.log(`Creating ${numLocations} locations...`);
          const locationPromises = [];
          for (let i = 0; i < numLocations; i++) {
            const locationData = fakeLocation();
            locationPromises.push(Location.create(locationData));
          }
          const locations = await Promise.all(locationPromises);
          console.log(`✓ Created ${locations.length} locations`);

          const sectorsPerLocation = 2;
          console.log(
            `Creating ${numLocations * sectorsPerLocation} sectors...`
          );
          const sectorPromises = [];
          for (let i = 0; i < numLocations; i++) {
            for (let j = 0; j < sectorsPerLocation; j++) {
              const sectorData = fakeSector();
              sectorPromises.push(Sector.create(sectorData));
            }
          }
          const sectors = await Promise.all(sectorPromises);
          console.log(`✓ Created ${sectors.length} sectors`);

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

          console.log('Linking climbs and images to sectors...');
          for (const climb of climbs) {
            await Sector.findByIdAndUpdate(climb.sector, {
              $addToSet: { climbs: climb._id, images: climb.image },
            });
          }
          console.log('✓ Linked climbs and images to sectors');

          console.log(`Creating ${numClimbHistories} climb histories...`);
          const climbHistoryPromises = [];
          for (let i = 0; i < numClimbHistories; i++) {
            const randomClimb = faker.helpers.arrayElement(climbs);

            const climbHistoryData = {
              ...fakeClimbHistory(),
              climb: randomClimb._id,
              location: randomClimb.location,
              sector: randomClimb.sector,
            };
            climbHistoryPromises.push(ClimbHistory.create(climbHistoryData));
          }
          const climbHistories = await Promise.all(climbHistoryPromises);
          console.log(`✓ Created ${climbHistories.length} climb histories`);

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

        process.exit(0);
      }
    );
}
