import { Argument, Command, Option } from 'commander';

type Settings<TArg = void, TOptions = Record<string, unknown>> = {
  name: string;
  description: string;
  action: TArg extends void
    ? (options: TOptions) => Promise<void> | void
    : (arg: TArg, options: TOptions) => Promise<void> | void;
  options?: ({
    flags: string;
    description: string;
  } & (
    | {
        type?: 'string';
        defaultValue?: string;
      }
    | {
        type?: 'number';
        defaultValue?: number;
      }
  ))[];
  arguments?: TArg extends void
    ? never
    : { name: string; description: string }[];
};

function register(program: Command, settings: Settings<any, any>) {
  const command = program
    .command(settings.name)
    .description(settings.description);

  settings.arguments?.forEach((argument) => {
    command.addArgument(new Argument(argument.name, argument.description));
  });

  command.action(settings.action);

  settings.options?.forEach((optionSettings) => {
    let option = new Option(optionSettings.flags, optionSettings.description);

    switch (optionSettings.type) {
      case 'number':
        option = option.argParser((value) => parseInt(value));
        break;
      default:
        break;
    }

    if (optionSettings.defaultValue !== undefined) {
      option = option.default(optionSettings.defaultValue);
    }

    command.addOption(option);
  });
}

export default register;
export type { Settings };
