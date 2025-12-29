import { Climb } from '../climb/climb';
import { Location } from '../location/location';
import { Sector } from '../sector/sector';

export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt' | 'project';

export type ClimbHistory = {
  /* Data */
  id: string;
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;

  /* References */
  climb: Omit<Climb, 'image' | 'location' | 'sector'> & {
    image: string;
    location: string;
    sector: string;
  };
  location: Omit<Location, 'sectors'> & { sectors: string[] };
  sector: Omit<Sector, 'climbs'> & { climbs: string[] };

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
