import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed;
Object.assign(process.env, env);

import { Command } from 'commander';

import registerAuthCommand from './commands/auth';
import registerModel3dCommand from './commands/model-3d';
import registerMoonboardCommand from './commands/moonboard';
import registerSeedCommand from './commands/seed';
import registerSetupCommand from './commands/setup';

const program = new Command();

program.name('cli').description('Developer CLI tool');

registerAuthCommand(program);
registerModel3dCommand(program);
registerMoonboardCommand(program);
registerSeedCommand(program);
registerSetupCommand(program);

export function run(): void {
  program.parse();
}

export { program };
