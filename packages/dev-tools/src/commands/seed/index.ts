import type { Command } from 'commander';

import { registerSeedClimbHistoriesCommand } from './climb-histories';
import { registerSeedClimbsCommand } from './climbs';
import { registerSeedImagesCommand } from './images';
import { registerSeedLocationsCommand } from './locations';
import { registerSeedSectorsCommand } from './sectors';

export default function registerSeedCommand(program: Command): void {
  const seedCmd = program
    .command('seed')
    .description('Seed individual entities (composable building blocks)');

  registerSeedImagesCommand(seedCmd);
  registerSeedClimbsCommand(seedCmd);
  registerSeedSectorsCommand(seedCmd);
  registerSeedLocationsCommand(seedCmd);
  registerSeedClimbHistoriesCommand(seedCmd);

  seedCmd.action(() => {
    console.log();
    console.log('Available seed commands:');
    console.log();
    console.log(
      '  dev-tools seed images            Seed N images for an owner'
    );
    console.log('  dev-tools seed climbs            Seed N climbs in a sector');
    console.log(
      '  dev-tools seed sectors           Seed N sectors in a location'
    );
    console.log(
      '  dev-tools seed locations         Seed N locations (full subtree)'
    );
    console.log(
      '  dev-tools seed climb-histories   Seed a climb history for a climb'
    );
    console.log();
  });
}
