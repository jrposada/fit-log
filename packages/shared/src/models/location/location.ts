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
  sectors: Sector[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
