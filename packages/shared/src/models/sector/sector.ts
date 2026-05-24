import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Climb } from '../climb/climb.ts';
import { Image } from '../image/image.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

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
    images: WithDepopulatedOwnership<Image>[];
    climbs: (Omit<
      WithDepopulatedOwnership<Climb>,
      'image' | 'location' | 'sector'
    > & {
      image: string;
      location: string;
      sector: string;
    })[];
  }>
>;
