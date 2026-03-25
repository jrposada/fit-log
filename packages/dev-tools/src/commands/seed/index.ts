import type { Command } from 'commander';

import { registerSeedCommand as registerSeedDataCommand } from './seed';
import { registerNukeCommand } from './nuke';

export default function registerSeedCommand(program: Command): void {
  const seedCmd = program
    .command('seed')
    .description('Seed and manage database data');

  registerSeedDataCommand(seedCmd);
  registerNukeCommand(seedCmd);

  seedCmd.action(() => {
    console.log();
    console.log('Available seed commands:');
    console.log();
    console.log('  dev-tools seed data    Seed DB with mock data');
    console.log('  dev-tools seed nuke    Delete all items from the database');
    console.log();
  });
}
