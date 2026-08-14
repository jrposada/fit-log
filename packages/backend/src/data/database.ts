import { assert } from '@jrposada/fit-log-shared/utils/assert';
import mongoose from 'mongoose';

import type { Lifecycle } from '../infrastructure/lifecycle.ts';
import Logger from '../infrastructure/logger.ts';

export function createDatabase(): Lifecycle {
  function onConnection() {
    Logger.info('✅ Connected to MongoDB');
  }

  function onError(error: Error) {
    Logger.error('MongoDB connection error:', error);
  }

  function onDisconnected() {
    Logger.info('MongoDB disconnected');
  }

  async function start(): Promise<void> {
    assert(process.env.DATABASE_ENDPOINT, {
      msg: 'DATABASE_ENDPOINT is not set',
    });

    mongoose.connection.on('connection', onConnection);
    mongoose.connection.on('error', onError);
    mongoose.connection.on('disconnected', onDisconnected);

    await mongoose.connect(process.env.DATABASE_ENDPOINT);
  }

  async function stop(): Promise<void> {
    mongoose.connection.off('error', onError);
    mongoose.connection.off('disconnected', onDisconnected);

    await mongoose.disconnect();
    Logger.info('🔌 Disconnected from MongoDB');
  }

  return { start, stop };
}
