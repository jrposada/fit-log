import { WithOwnership } from '../auth/with-ownership';
import { Climb } from '../climb/climb';
import { Image } from '../image/image';
import { WithTimestamps } from '../utils/with-timestamps';

export type Sector = WithOwnership<
  WithTimestamps<{
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
  }>
>;
