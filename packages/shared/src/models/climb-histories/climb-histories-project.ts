import z from 'zod';

export type ClimbHistoryProjectRequest = {
  isProject: boolean;

  climb: string;
  location: string;
  sector: string;
};

export const climbHistoryProjectRequestSchema = z.object({
  isProject: z.boolean(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbHistoryProjectResponse = {
  climbHistory: import('./climb-history').ClimbHistory | null;
};
