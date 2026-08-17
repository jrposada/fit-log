import dotenv from 'dotenv';

import { createServer } from './api/server.ts';
import { createDatabase } from './data/database.ts';
import type { Lifecycle } from './infrastructure/lifecycle.ts';
import Logger from './infrastructure/logger.ts';
import { createJobsManager } from './jobs/jobs-manager.ts';

dotenv.config();

let api: Lifecycle | undefined;
let database: Lifecycle | undefined;
let jobs: Lifecycle | undefined;

async function main() {
  database = createDatabase();
  await database.start();

  jobs = createJobsManager();
  await jobs.start();

  api = createServer();
  await api.start();
}

process.on('SIGINT', async () => {
  try {
    await api?.stop();
    await jobs?.stop();
    await database?.stop();
    process.exit(0);
  } catch (error) {
    Logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

main().catch((error) => {
  Logger.error('Error in main execution:', error);
  process.exit(1);
});
