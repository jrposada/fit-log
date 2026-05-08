import z from 'zod';

export type CollaboratorPutParams = {
  id: string;
  userId: string;
};
export const collaboratorPutParamsSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
});

export type CollaboratorPutRequest = {
  permission: 'edit' | 'delete';
};
export const collaboratorPutRequestSchema = z.object({
  permission: z.enum(['edit', 'delete']),
});
