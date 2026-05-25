import { ClimbHistoryStatus } from '../../common/climb-histories/climb-history-statuses.ts';
import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { Climb } from '../climbs/climb.ts';
import { Location } from '../locations/location.ts';
import { Sector } from '../sectors/sector.ts';
import { TrainingSession } from '../training-sessions/training-session.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

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
  trainingSession:
    | (Omit<TrainingSession, 'location' | 'climbHistories'> & {
        location?: string;
        climbHistories: string[];
      })
    | null;
}>;
