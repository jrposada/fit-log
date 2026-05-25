import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { Climb } from '../climb/climb.ts';
import { Location } from '../location/location.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type TrainingSession = WithTimestamps<{
  /* Data */
  id: string;
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  lastActivityAt?: Date;

  /* References */
  location?: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
    sectors: string[];
  };
  climbs: Omit<
    WithDepopulatedOwnership<Climb>,
    'image' | 'location' | 'sector'
  > &
    {
      image: string;
      location: string;
      sector: string;
    }[];
}>;
