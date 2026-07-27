import z from 'zod';

import { Sport, SPORTS } from '../../common/sports/sports.ts';
import { SessionSummary } from './feed.ts';

export type FeedGetQuery = {
  limit?: number;
  cursor?: string;
  sport?: Sport;
  locationId?: string;
  startDate?: string;
  endDate?: string;
};

export const feedGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  sport: z.enum(SPORTS).optional(),
  locationId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type FeedGetResponse = {
  sessions: SessionSummary[];
  nextCursor: string | null;
};
