import type { Command } from 'commander';

import { registerSetupCommand as registerSetupDataCommand } from './setup';
import { registerNukeCommand } from './nuke';

export default function registerSetupCommand(program: Command): void {
  const setupCmd = program
    .command('setup')
    .description('Seed and manage database data');

  registerSetupDataCommand(setupCmd);
  registerNukeCommand(setupCmd);

  setupCmd.action(() => {
    console.log();
    console.log('Available setup commands:');
    console.log();
    console.log('  dev-tools setup data    Seed DB with mock data');
    console.log('  dev-tools setup nuke    Delete all items from the database');
    console.log();
  });
}
