import type { Lifecycle } from '../infrastructure/lifecycle.ts';
import { closeModel3dReconstructionQueue } from './queues/model-3d-reconstruction-queue.ts';
import { createModel3dReconstructionWorker } from './workers/model-3d-reconstruction-worker.ts';

/**
 * Owns every background worker/queue in the app. `index.ts` only ever talks
 * to this one `Lifecycle` — adding a new job type means wiring it in here,
 * not touching `index.ts` again.
 */
export function createJobsManager(): Lifecycle {
  const model3dReconstructionWorker = createModel3dReconstructionWorker();

  async function start(): Promise<void> {
    await model3dReconstructionWorker.start();
  }

  async function stop(): Promise<void> {
    await model3dReconstructionWorker.stop();
    await closeModel3dReconstructionQueue();
  }

  return { start, stop };
}
