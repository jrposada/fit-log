import z from 'zod';

import { Model3d } from './model-3d.ts';

export type Model3dsFromVideoPostRequest = {
  base64: string;
  mimeType: string;
};
export const model3dsFromVideoPostRequestSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
});

/** `model3d.status` is 'processing' — the reconstruction job has only just
 * been queued, not completed. */
export type Model3dsFromVideoPostResponse = {
  model3d: Model3d;
};
