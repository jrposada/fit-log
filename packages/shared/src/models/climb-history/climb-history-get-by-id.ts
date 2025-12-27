import z from 'zod';

import { ClimbHistory } from './climb-history';

export type ClimbHistoriesGetByIdParams = {
  id: string;
};

export const climbHistoriesGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbHistoriesGetByIdResponse = {
  climbHistory: ClimbHistory;
};
