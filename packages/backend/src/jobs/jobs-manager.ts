import { batch } from '@jrposada/fit-log-shared/utils/batch';

import type { Lifecycle } from '../infrastructure/lifecycle.ts';
import Logger from '../infrastructure/logger.ts';
import registerQueues from './queues/queues.ts';
import registerWorkers from './workers/workers.ts';

/**
 * Owns every background worker/queue in the app. `index.ts` only ever talks
 * to this one `Lifecycle` — adding a new job type means wiring it in here,
 * not touching `index.ts` again.
 */
export function createJobsManager(): Lifecycle {
  const allWorkers = registerWorkers();
  const allQueues = registerQueues();

  async function start(): Promise<void> {
    let count = 0;

    const batches = batch(allWorkers, 10);
    Logger.info(
      `Stopping workers ${allWorkers.length} (${batches.length} batches)...`
    );
    for (const workers of batches) {
      Logger.info(
        `Starting workers - ${count} | ${workers.length} (done | current batch)...`
      );
      await Promise.allSettled(workers.map((worker) => worker.start()));
      count += workers.length;
    }

    Logger.info('Workers ready');
  }

  async function stop(): Promise<void> {
    let workersCount = 0;

    const workersBatches = batch(allWorkers, 10);
    Logger.info(
      `Stopping workers ${allWorkers.length} (${workersBatches.length} batches)...`
    );
    for (const workers of workersBatches) {
      Logger.info(
        `Stopping workers - ${workersCount} | ${workers.length} (done | current batch)...`
      );
      await Promise.allSettled(workers.map((worker) => worker.stop()));
      workersCount += workers.length;
    }

    Logger.info('Workers stopped');

    let queuesCount = 0;

    const queuesBatches = batch(allQueues, 10);
    Logger.info(
      `Stopping workers ${allQueues.length} (${queuesBatches.length} batches)...`
    );
    for (const queues of queuesBatches) {
      Logger.info(
        `Stopping workers - ${queuesCount} | ${queues.length} (done | current batch)...`
      );
      await Promise.allSettled(queues.map((queue) => queue.stop()));
      queuesCount += queues.length;
    }

    Logger.info('Queues stopped');
  }

  return { start, stop };
}
