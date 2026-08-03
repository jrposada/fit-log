import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { ClimbHistory } from '../climb-histories/climb-history.ts';
import { Location } from '../locations/location.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

/** A session with no activity for this long is considered stale — the next
 * write starts a fresh session rather than resuming it. */
export const SESSION_STALE_MS = 4 * 60 * 60 * 1000;

export type TrainingSession = WithTimestamps<{
  /* Data */
  id: string;
  title: string;
  notes?: string;
  startedAt: string;
  endedAt?: string;
  lastActivityAt?: string;

  /* Ownership */
  owner: string;

  /* References */
  location?: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
    sectors: string[];
  };
  climbHistories: (Omit<
    ClimbHistory,
    'climb' | 'location' | 'sector' | 'climbingSession'
  > & {
    climb: string;
    location: string;
    sector: string;
  })[];
}>;
