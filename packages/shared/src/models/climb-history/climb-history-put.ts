import z from 'zod';

export type ClimbHistoriesPutRequest = {
  tryId?: string;

  status: 'send' | 'flash' | 'attempt' | 'project';
  attempts?: number;
  notes?: string;
  date?: string;

  climb: string;
  location: string;
  sector: string;
};

export const climbHistoriesPutRequestSchema = z.object({
  tryId: z.string().optional(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbHistoriesPutResponse = {
  climbHistory: import('./climb-history').ClimbHistory;
};
