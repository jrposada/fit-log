import z from 'zod';

export type CollaboratorDeleteParams = {
  id: string;
  userId: string;
};
export const collaboratorDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
});
