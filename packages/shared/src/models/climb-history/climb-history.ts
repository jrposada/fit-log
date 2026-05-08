import { Climb } from '../climb/climb';
import { Location } from '../location/location';
import { Sector } from '../sector/sector';
import { WithTimestamps } from '../utils/with-timestamps';

export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt';

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
  climb: Omit<Climb, 'image' | 'location' | 'sector'> & {
    image: string;
    location: string;
    sector: string;
  };
  location: Omit<Location, 'sectors'> & { sectors: string[] };
  sector: Omit<Sector, 'climbs'> & { climbs: string[] };
}>;
