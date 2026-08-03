import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Climb } from '../climbs/climb.ts';
import { Image } from '../images/image.ts';
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
      'image' | 'location' | 'sector' | 'model3d'
    > & {
      image: string | null;
      location: string;
      sector: string;
      model3d: string | null;
    })[];
  }>
>;
