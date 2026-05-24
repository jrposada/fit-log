import type { Command } from 'commander';
import { MoonboardClient } from '@jrposada/moonboard-sdk';

export default function registerMoonboardCommand(program: Command): void {
  const moonboardCmd = program
    .command('moonboard')
    .description('Moonboard utilities');

  moonboardCmd
    .command('fetch')
    .description(
      'Fetch problems and benchmarks from Moonboard and print JSON to stdout.\n' +
        'Requires MOONBOARD_USERNAME and MOONBOARD_PASSWORD in .env.\n\n' +
        'Usage: pnpm dev-tools moonboard fetch > src/commands/seed/mock-data/moonboard-problems.json'
    )
    .action(async () => {
      const username = process.env.MOONBOARD_USERNAME;
      const password = process.env.MOONBOARD_PASSWORD;
      if (!username) {
        console.error('Missing MOONBOARD_USERNAME in environment');
        process.exit(1);
      }
      if (!password) {
        console.error('Missing MOONBOARD_PASSWORD in environment');
        process.exit(1);
      }

      const client = new MoonboardClient();
      try {
        await client.connect(username, password);
        const data = await client.fetchAll();
        process.stdout.write(JSON.stringify(data, null, 2));
        process.stdout.write('\n');
      } catch (err) {
        console.error('Failed to fetch Moonboard data:', err);
        process.exitCode = 1;
      } finally {
        client.disconnect();
      }
    });

  moonboardCmd.action(() => {
    console.log();
    console.log('Available moonboard commands:');
    console.log();
    console.log(
      '  dev-tools moonboard fetch   Fetch problems/benchmarks and print JSON to stdout'
    );
    console.log();
  });
}
