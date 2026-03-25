import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed;
Object.assign(process.env, env);

import { Command } from 'commander';

import registerAuthCommand from './commands/auth';
import registerSeedCommand from './commands/seed';

const program = new Command();

program.name('dev-tools').description('Developer CLI tool');

registerAuthCommand(program);
registerSeedCommand(program);

export function run(): void {
  program.parse();
}

export { program };
