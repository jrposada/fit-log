import type { Command } from 'commander';

import { registerSeedClimbHistoriesCommand } from './climb-histories';
import { registerSeedClimbsCommand } from './climbs';
import { registerSeedImagesCommand } from './images';
import { registerSeedLocationsCommand } from './locations';
import { registerSeedSectorsCommand } from './sectors';
import { registerSeedTrainingSessionsCommand } from './training-sessions';
import { registerSeedWorkoutsCommand } from './workouts';

export default function registerSeedCommand(program: Command): void {
  const seedCmd = program
    .command('seed')
    .description('Seed individual entities (composable building blocks)');

  registerSeedImagesCommand(seedCmd);
  registerSeedClimbsCommand(seedCmd);
  registerSeedSectorsCommand(seedCmd);
  registerSeedLocationsCommand(seedCmd);
  registerSeedClimbHistoriesCommand(seedCmd);
  registerSeedTrainingSessionsCommand(seedCmd);
  registerSeedWorkoutsCommand(seedCmd);

  seedCmd.action(() => {
    console.log();
    console.log('Available seed commands:');
    console.log();
    console.log('  cli seed images            Seed N images for an owner');
    console.log('  cli seed climbs            Seed N climbs in a sector');
    console.log('  cli seed sectors           Seed N sectors in a location');
    console.log('  cli seed locations         Seed N locations (full subtree)');
    console.log(
      '  cli seed climb-histories   Seed a climb history for a climb'
    );
    console.log('  cli seed workouts          Seed N workouts');
    console.log(
      '  cli seed training-sessions Seed a standalone training session'
    );
    console.log();
  });
}
