import z from 'zod';

import { COLLABORATOR_PERMISSIONS } from './with-ownership';

export type CollaboratorPutParams = {
  id: string;
  userId: string;
};
export const collaboratorPutParamsSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
});

export type CollaboratorPutRequest = {
  permission: (typeof COLLABORATOR_PERMISSIONS)[number];
};
export const collaboratorPutRequestSchema = z.object({
  permission: z.enum(COLLABORATOR_PERMISSIONS),
});
