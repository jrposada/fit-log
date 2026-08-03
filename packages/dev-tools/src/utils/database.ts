import { createDatabase } from '@backend/data/database';

const database = createDatabase();

export function connectToDatabase(): Promise<void> {
  return database.start();
}

export function disconnectFromDatabase(): Promise<void> {
  return database.stop();
}
