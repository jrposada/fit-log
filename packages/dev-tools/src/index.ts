import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed;
Object.assign(process.env, env);

import { Command } from 'commander';

import registerAuthCommand from './commands/auth';
import registerProcessModelCommand from './commands/process-model';
import registerSeedCommand from './commands/seed';
import registerSetupCommand from './commands/setup';

const program = new Command();

program.name('dev-tools').description('Developer CLI tool');

registerAuthCommand(program);
registerProcessModelCommand(program);
registerSeedCommand(program);
registerSetupCommand(program);

export function run(): void {
  program.parse();
}

export { program };
