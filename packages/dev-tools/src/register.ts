import { Argument, Command, Option } from 'commander';

type Settings<TArg, TOptions> = {
  name: string;
  description: string;
  action: (arg: TArg, options: TOptions) => Promise<void> | void;
  options?: {
    flags: string;
    description: string;
    type?: 'string' | 'number';
  }[];
  arguments?: { name: string; description: string }[];
};

function register(program: Command, settings: Settings<any, any>) {
  const command = program
    .command(settings.name)
    .description(settings.description)
    .action(settings.action);

  settings.arguments?.forEach((argument) => {
    command.addArgument(new Argument(argument.name, argument.description));
  });

  settings.options?.forEach((optionSettings) => {
    const option = new Option(optionSettings.flags, optionSettings.description);
    switch (optionSettings.type) {
      case 'number':
        option.argParser((value) => parseInt(value));
        break;
      default:
        break;
    }
    command.addOption(option);
  });
}

export default register;
export type { Settings };
