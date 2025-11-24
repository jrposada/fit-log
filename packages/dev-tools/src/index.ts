import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed;
Object.assign(process.env, env);

import { program } from 'commander';
import nukeCommand from './seed/nuke-command';
import seedCommand from './seed/seed-command';
import register from './register';

program.name('dev-tools').description('Developer CLI tool');

register(program, seedCommand);
register(program, nukeCommand);

program.parse();
