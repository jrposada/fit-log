import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Climb } from '../climb/climb.ts';
import { Location } from '../location/location.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type TrainingSession = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    title: string;
    notes?: string;
    startedAt: string;
    endedAt?: string;
    lastActivityAt: string;

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
  }>
>;
