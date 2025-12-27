import z from 'zod';

import { Image } from './image';

export type ImagesPostRequest = {
  base64: string;
  mimeType: string;
};
export const imagesPostRequestSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
});

export type ImagesPostResponse = {
  image: Image;
};
