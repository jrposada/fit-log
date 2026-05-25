import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { Climb } from '../climbs/climb.ts';
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

  /* References */
  location?: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
    sectors: string[];
  };
  climbs: (Omit<
    WithDepopulatedOwnership<Climb>,
    'image' | 'location' | 'sector'
  > & {
    image: string;
    location: string;
    sector: string;
  })[];
}>;
