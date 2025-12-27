import z from 'zod';

export type Session = {
  id: string;

  completedAt: string;
  createdAt: string;
  updatedAt: string;
};
export const sessionSchema = z.object({
  id: z.string().nonempty(),
  completedAt: z.string().datetime(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
