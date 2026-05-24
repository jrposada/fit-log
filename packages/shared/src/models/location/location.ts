import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Sector } from '../sector/sector.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

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
