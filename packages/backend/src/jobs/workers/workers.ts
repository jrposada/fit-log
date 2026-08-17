import type { Lifecycle } from '../../infrastructure/lifecycle.ts';
import { createModel3dReconstructionWorker } from './model-3d-reconstruction-worker/model-3d-reconstruction-worker.ts';

function registerWorkers(): Lifecycle[] {
  return [createModel3dReconstructionWorker()];
}

export default registerWorkers;
