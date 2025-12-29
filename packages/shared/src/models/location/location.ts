import { Sector } from '../sector/sector';

export type Location = {
  /* Data */
  id: string;
  name: string;
  description?: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  sectors: (Omit<Sector, 'climbs'> & { climbs: string[] })[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
