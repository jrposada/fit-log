import { assert } from '@shared/utils/assert';
import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    assert(process.env.DATABASE_ENDPOINT, {
      msg: 'DATABASE_ENDPOINT is not set',
    });

    await mongoose.connect(process.env.DATABASE_ENDPOINT);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
