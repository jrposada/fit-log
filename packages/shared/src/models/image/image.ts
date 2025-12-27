import z from 'zod';

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
