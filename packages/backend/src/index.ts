import dotenv from 'dotenv';

import { createServer } from './api/server.ts';
import { createDatabase } from './data/database.ts';
import type { Lifecycle } from './infrastructure/lifecycle.ts';

dotenv.config();

let api: Lifecycle | undefined;
let database: Lifecycle | undefined;

async function main() {
  database = createDatabase();
  await database.start();

  api = createServer();
  await api.start();
}

process.on('SIGINT', async () => {
  try {
    await api?.stop();
    await database?.stop();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

main().catch((error) => {
  console.error('Error in main execution:', error);
  process.exit(1);
});
