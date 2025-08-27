import { Command } from 'commander';

type Settings = {
  name: string;
  description: string;
  action: () => void;
};

function register(program: Command, command: Settings) {
  program
    .command(command.name)
    .description(command.description)
    .action(command.action);
}

export default register;
export type { Settings };
