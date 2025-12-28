import { Climb } from '../climb/climb';
import { Image } from '../image/image';

export type Sector = {
  /* Data */
  id: string;
  name: string;
  description?: string;
  isPrimary: boolean;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  images: Image[];
  climbs: (Omit<Climb, 'image' | 'location' | 'sector'> & {
    image: string;
    location: string;
    sector: string;
  })[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
