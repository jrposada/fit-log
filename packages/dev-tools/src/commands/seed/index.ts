import type { Command } from 'commander';

import { registerSeedClimbsCommand } from './climbs';
import { registerSeedImagesCommand } from './images';

export default function registerSeedCommand(program: Command): void {
  const seedCmd = program
    .command('seed')
    .description('Seed individual entities (composable building blocks)');

  registerSeedImagesCommand(seedCmd);
  registerSeedClimbsCommand(seedCmd);

  seedCmd.action(() => {
    console.log();
    console.log('Available seed commands:');
    console.log();
    console.log('  dev-tools seed images   Seed N images for an owner');
    console.log('  dev-tools seed climbs   Seed N climbs in a sector');
    console.log();
  });
}
