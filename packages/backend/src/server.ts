import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectToDatabase, disconnectFromDatabase } from './database';
import { router } from './router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export default app;
