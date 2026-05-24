import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { Climb } from '../climb/climb.ts';
import { Location } from '../location/location.ts';
import { Sector } from '../sector/sector.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export const CLIMB_HISTORY_STATUSES = ['send', 'flash', 'attempt'] as const;
export type ClimbHistoryStatus = (typeof CLIMB_HISTORY_STATUSES)[number];

export const CLIMB_HISTORY_QUERY_STATUSES = [
  ...CLIMB_HISTORY_STATUSES,
  'project',
] as const;

export type ClimbHistoryTry = {
  id: string;
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;
  date: string;
};

export type ClimbHistory = WithTimestamps<{
  /* Data */
  id: string;
  status: ClimbHistoryStatus;
  isProject: boolean;
  tries: ClimbHistoryTry[];

  /* Ownership */
  owner: string;

  /* References */
  climb: Omit<
    WithDepopulatedOwnership<Climb>,
    'image' | 'location' | 'sector'
  > & {
    image: string;
    location: string;
    sector: string;
  };
  location: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
    sectors: string[];
  };
  sector: Omit<WithDepopulatedOwnership<Sector>, 'climbs'> & {
    climbs: string[];
  };
}>;
