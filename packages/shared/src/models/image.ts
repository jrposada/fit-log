import z from 'zod';

////////////
// Models //
////////////
export type Image = {
  /* Data */
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};

export const imageSchema = z.object({
  id: z.string().nonempty(),
  imageUrl: z.string(),
  thumbnailUrl: z.string(),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

//////////
// POST //
//////////
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
