import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership';
import { Sector } from '../sector/sector';
import { WithTimestamps } from '../utils/with-timestamps';

export type Location = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    name: string;
    description?: string;

    latitude: number;
    longitude: number;
    googleMapsId?: string;

    /* References */
    sectors: (Omit<WithDepopulatedOwnership<Sector>, 'climbs'> & {
      climbs: string[];
    })[];
  }>
>;
