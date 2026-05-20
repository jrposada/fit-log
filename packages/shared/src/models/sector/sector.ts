import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership';
import { Climb } from '../climb/climb';
import { Image } from '../image/image';
import { Model3D } from '../model3d/model3d';
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
    images: WithDepopulatedOwnership<Image>[];
    models3d: WithDepopulatedOwnership<Model3D>[];
    climbs: (Omit<
      WithDepopulatedOwnership<Climb>,
      'image' | 'location' | 'model3d' | 'sector'
    > & {
      image: string;
      location: string;
      model3d?: string;
      sector: string;
    })[];
  }>
>;
