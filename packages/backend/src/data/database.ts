import { assert } from '@jrposada/fit-log-shared/utils/assert';
import mongoose from 'mongoose';

import type { Lifecycle } from '../infrastructure/lifecycle.ts';

export function createDatabase(): Lifecycle {
  function onError(error: Error) {
    console.error('MongoDB connection error:', error);
  }

  function onDisconnected() {
    console.log('MongoDB disconnected');
  }

  async function start(): Promise<void> {
    assert(process.env.DATABASE_ENDPOINT, {
      msg: 'DATABASE_ENDPOINT is not set',
    });

    mongoose.connection.on('error', onError);
    mongoose.connection.on('disconnected', onDisconnected);

    await mongoose.connect(process.env.DATABASE_ENDPOINT);
    console.log('✅ Connected to MongoDB');
  }

  async function stop(): Promise<void> {
    mongoose.connection.off('error', onError);
    mongoose.connection.off('disconnected', onDisconnected);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }

  return { start, stop };
}
