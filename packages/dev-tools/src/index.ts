import { program } from 'commander';
import seedCommand from './seed/seed-command';
import register from './register';

register(program, seedCommand);

program.parse();
