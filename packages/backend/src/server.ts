import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectToDatabase, disconnectFromDatabase } from './database';
import { router } from './router';
import { FilesService } from './services/files';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3100;

async function main() {
  await FilesService.ensureDirectories();

  app.use(cors());
  app.use(express.json());

  app.use('/files', express.static(FilesService.publicDir()));
  app.use('/api', router);
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

main().catch((error) => {
  console.error('Error in main execution:', error);
  process.exit(1);
});

export default app;
