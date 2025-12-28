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
  sectors: (Omit<Sector, 'images' | 'climbs'> & {
    images: string[];
    climbs: string[];
  })[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
