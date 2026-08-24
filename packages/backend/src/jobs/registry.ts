import type { Lifecycle } from '../infrastructure/lifecycle.ts';
import { createModel3dReconstructionQueue } from './model-3d-reconstruction/model-3d-reconstruction-queue.ts';
import { createModel3dReconstructionWorker } from './model-3d-reconstruction/model-3d-reconstruction-worker.ts';

function registerQueues(): Lifecycle[] {
  return [createModel3dReconstructionQueue()];
}

function registerWorkers(): Lifecycle[] {
  return [createModel3dReconstructionWorker()];
}

export { registerQueues, registerWorkers };
