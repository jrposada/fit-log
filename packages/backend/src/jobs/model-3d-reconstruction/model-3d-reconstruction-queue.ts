import { Queue } from 'bullmq';

import type { Lifecycle } from '../../infrastructure/lifecycle.ts';
import { createBullMqRedisConnection } from '../infrastructure/redis.ts';

export const MODEL_3D_RECONSTRUCTION_QUEUE_NAME = 'model-3d-reconstruction';

export type Model3dReconstructionJobData = {
  model3dId: string;
  videoPath: string;
};

let queue: Queue<Model3dReconstructionJobData> | undefined;

function getQueue(): Queue<Model3dReconstructionJobData> {
  if (!queue) {
    queue = new Queue<Model3dReconstructionJobData>(
      MODEL_3D_RECONSTRUCTION_QUEUE_NAME,
      { connection: createBullMqRedisConnection() }
    );
  }
  return queue;
}

export async function enqueueModel3dReconstruction(
  data: Model3dReconstructionJobData
): Promise<void> {
  await getQueue().add('reconstruct', data);
}

export async function closeModel3dReconstructionQueue(): Promise<void> {
  if (queue) {
    await queue.close();
    queue = undefined;
  }
}

export function createModel3dReconstructionQueue(): Lifecycle {
  function start(): Promise<void> {
    getQueue();
    return Promise.resolve();
  }

  return { start, stop: closeModel3dReconstructionQueue };
}
