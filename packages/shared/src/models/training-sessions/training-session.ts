import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { ClimbHistory } from '../climb-histories/climb-history.ts';
import { Location } from '../locations/location.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

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
    'climb' | 'location' | 'sector' | 'trainingSession'
  > & {
    climb: string;
    location: string;
    sector: string;
  })[];
}>;
