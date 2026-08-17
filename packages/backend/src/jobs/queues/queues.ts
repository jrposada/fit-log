import type { Lifecycle } from '../../infrastructure/lifecycle.ts';
import { createModel3dReconstructionQueue } from './model-3d-reconstruction-queue.ts';

function registerQueues(): Lifecycle[] {
  return [createModel3dReconstructionQueue()];
}

export default registerQueues;
