import z from 'zod';

import { Model3d } from './model-3d.ts';

export type Model3dsPostRequest = {
  base64: string;
  mimeType: string;
};
export const model3dsPostRequestSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
});

export type Model3dsPostResponse = {
  model3d: Model3d;
};
