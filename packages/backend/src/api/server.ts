import type { Server } from 'node:http';

import cors from 'cors';
import express from 'express';

import type { Lifecycle } from '../infrastructure/lifecycle.ts';
import Logger from '../infrastructure/logger.ts';
import { FilesService } from '../services/files.ts';
import { traceId } from './middlewares/trace-id.ts';
import { router } from './routes/router.ts';

export function createServer(): Lifecycle {
  let server: Server | undefined;

  async function start(): Promise<void> {
    await FilesService.ensureDirectories();

    const app = express();

    app.use(cors());
    app.use(traceId);
    app.use(express.json({ limit: '512mb' }));

    app.use('/files', express.static(FilesService.publicDir()));
    app.use('/api', router);
    app.get('/health', (_req, res) => {
      res.json({ status: 'ok' });
    });

    const port = process.env.PORT || 3100;

    return await new Promise<void>((resolve, reject) => {
      server = app
        .listen(port, () => {
          Logger.info(`🚀 Server is running on http://localhost:${port}`);
          resolve();
        })
        .on('error', reject);
    });
  }

  function stop(): Promise<void> {
    const current = server;
    if (!current) {
      return Promise.resolve();
    }

    server = undefined;
    return new Promise<void>((resolve, reject) => {
      current.close((error) => (error ? reject(error) : resolve()));
    });
  }

  return { start, stop };
}
