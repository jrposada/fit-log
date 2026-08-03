import { Sport } from '../../common/sports/sports.ts';
import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Sector } from '../sectors/sector.ts';
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

    /** Derived from the requesting owner's sessions that reference this
     * location — not a stored tag. Only present on the top-level location
     * endpoints, not when embedded (depopulated) elsewhere. */
    sports?: Sport[];

    /* References */
    sectors: (Omit<WithDepopulatedOwnership<Sector>, 'climbs'> & {
      climbs: string[];
    })[];
  }>
>;
