import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { User } from '@backend/models/user';
import { FilesService } from '@backend/services/files';
import { ImageProcessor } from '@backend/services/image-processor';
import { faker } from '@faker-js/faker';
import type { Command } from 'commander';
import { Types } from 'mongoose';

import { seedClimbHistory } from '../seed/climb-histories';
import { seedLocation } from '../seed/locations';
import { seedWorkout } from '../seed/workouts';
import { findKeycloakUserByEmail } from '../../utils/keycloak-admin';

interface CliOptions {
  numLocations: string;
  sectorsPerLocation: string;
  climbsPerSector: string;
  numWorkouts: string;
  climbHistoryChance: string;
}

export function registerSetupCommand(setupCmd: Command): void {
  setupCmd
    .command('data')
    .description('Seed DB with mock data')
    .option('--num-locations <value>', 'Number of locations to create', '50')
    .option('--sectors-per-location <value>', 'Sectors per location', '2')
    .option('--climbs-per-sector <value>', 'Climbs per sector', '3')
    .option('--num-workouts <value>', 'Number of workouts to create', '100')
    .option(
      '--climb-history-chance <value>',
      'Chance (0-1) each climb has history',
      '0.6'
    )
    .action(async (options: CliOptions) => {
      const numLocations = parseInt(options.numLocations);
      const sectorsPerLocation = parseInt(options.sectorsPerLocation);
      const climbsPerSector = parseInt(options.climbsPerSector);
      const numWorkouts = parseInt(options.numWorkouts);
      const climbHistoryChance = parseFloat(options.climbHistoryChance);

      try {
        await connectToDatabase();
        await FilesService.ensureDirectories();
        const imageProcessor = new ImageProcessor();

        // Bootstrap the dev Mongo user from Keycloak so when they log in
        // via the app, the auth middleware finds the existing record
        // (matched by `keycloakId`) and the seeded data is theirs.
        // Override with BOOTSTRAP_OWNER_EMAIL if needed.
        const seedOwnerEmail =
          process.env.BOOTSTRAP_OWNER_EMAIL ?? 'dev@example.com';

        let seedOwner = await User.findOne({ email: seedOwnerEmail });
        if (!seedOwner) {
          const kcUser = await findKeycloakUserByEmail(seedOwnerEmail);
          if (!kcUser) {
            throw new Error(
              `No Keycloak user found with email "${seedOwnerEmail}". ` +
                `Either create one in the realm or set BOOTSTRAP_OWNER_EMAIL.`
            );
          }
          const fullName = [kcUser.firstName, kcUser.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          seedOwner = await User.create({
            keycloakId: kcUser.id,
            email: kcUser.email,
            name: fullName || kcUser.email,
            roles: [],
          });
          console.log(
            `✓ Created Mongo user for Keycloak account ${seedOwner.email} (keycloakId=${kcUser.id})`
          );
        } else {
          console.log(`Using seed owner ${seedOwner.email}`);
        }
        const seedOwnerId = seedOwner._id as Types.ObjectId;

        // Synthetic non-Keycloak owners so seeded data has varied
        // ownership — exercises the "I see other users' public records
        // but can't edit them" path. They have unique synthetic
        // keycloakIds so they'll never match a real JWT.
        const NUM_EXTRA_OWNERS = 5;
        const existingExtras = await User.find({
          keycloakId: { $regex: '^synthetic-' },
        });
        const extraOwners = [...existingExtras];
        for (let i = existingExtras.length; i < NUM_EXTRA_OWNERS; i++) {
          const extra = await User.create({
            keycloakId: `synthetic-${faker.string.uuid()}`,
            email: `seed-user-${i + 1}@example.com`,
            name: faker.person.fullName(),
            roles: [],
          });
          extraOwners.push(extra);
        }

        // Per-location owner pool: dev weighted ×3 (so dev still sees
        // the majority of locations as theirs), each synthetic ×1.
        const locationOwnerPool: Types.ObjectId[] = [
          seedOwnerId,
          seedOwnerId,
          seedOwnerId,
          ...extraOwners.map((u) => u._id as Types.ObjectId),
        ];

        // Uniform pool for ClimbHistory — anyone can attempt anyone's
        // climb, regardless of who created it.
        const allOwners: Types.ObjectId[] = [
          seedOwnerId,
          ...extraOwners.map((u) => u._id as Types.ObjectId),
        ];

        console.log(
          `Owner pool: ${seedOwner.email} (×3) + ${extraOwners.length} synthetic users (×1 each)`
        );

        // Per-location subtree: location, its sectors, climbs and their
        // images all share an owner — modelling "user A set up this
        // gym/crag and its routes". ClimbHistory below is the cross-user
        // mixer.
        console.log(
          `Seeding ${numLocations} locations × ${sectorsPerLocation} sectors × ${climbsPerSector} climbs...`
        );
        const allClimbs = [];
        let totalSectors = 0;
        const locationLogEvery = Math.max(1, Math.floor(numLocations / 20));
        for (let i = 0; i < numLocations; i++) {
          const owner = faker.helpers.arrayElement(locationOwnerPool);
          const { sectors, climbs } = await seedLocation({
            owner,
            sectorsCount: sectorsPerLocation,
            climbsPerSector,
            imageProcessor,
          });
          totalSectors += sectors.length;
          allClimbs.push(...climbs);
          if ((i + 1) % locationLogEvery === 0 || i === numLocations - 1) {
            console.log(
              `  ...${i + 1}/${numLocations} locations (${totalSectors} sectors, ${allClimbs.length} climbs)`
            );
          }
        }
        console.log(
          `✓ Seeded ${numLocations} locations, ${totalSectors} sectors, ${allClimbs.length} climbs (+ images)`
        );

        // ClimbHistory pass — at most one history per (climb, owner)
        // pair (compound unique index). Owner picked uniformly so dev
        // sees a realistic mix of "their" attempts.
        console.log(
          `Seeding climb histories (${(climbHistoryChance * 100).toFixed(0)}% chance per climb, owned by any user)...`
        );
        let historyCount = 0;
        let climbsProcessed = 0;
        const climbLogEvery = Math.max(1, Math.floor(allClimbs.length / 20));
        for (const climb of allClimbs) {
          climbsProcessed += 1;
          if (!faker.datatype.boolean({ probability: climbHistoryChance })) {
            if (
              climbsProcessed % climbLogEvery === 0 ||
              climbsProcessed === allClimbs.length
            ) {
              console.log(
                `  ...${climbsProcessed}/${allClimbs.length} climbs processed (${historyCount} histories)`
              );
            }
            continue;
          }
          if (!climb.location || !climb.sector) continue;

          await seedClimbHistory({
            owner: faker.helpers.arrayElement(allOwners),
            climb: climb._id as Types.ObjectId,
            location: climb.location,
            sector: climb.sector,
          });
          historyCount += 1;
          if (
            climbsProcessed % climbLogEvery === 0 ||
            climbsProcessed === allClimbs.length
          ) {
            console.log(
              `  ...${climbsProcessed}/${allClimbs.length} climbs processed (${historyCount} histories)`
            );
          }
        }
        console.log(`✓ Seeded ${historyCount} climb histories`);

        console.log(`Seeding ${numWorkouts} workouts...`);
        const workoutLogEvery = Math.max(1, Math.floor(numWorkouts / 20));
        for (let i = 0; i < numWorkouts; i++) {
          await seedWorkout();
          if ((i + 1) % workoutLogEvery === 0 || i === numWorkouts - 1) {
            console.log(`  ...${i + 1}/${numWorkouts} workouts`);
          }
        }
        console.log(`✓ Seeded ${numWorkouts} workouts`);

        console.log('✓ Database seeded successfully!');
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
