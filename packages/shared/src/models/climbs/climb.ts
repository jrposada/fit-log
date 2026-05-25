import { ClimbGrade } from '../../common/climbs/grades.ts';
import { HoldType } from '../../common/climbs/holds.ts';
import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership.ts';
import { Image } from '../images/image.ts';
import { Location } from '../locations/location.ts';
import { Sector } from '../sectors/sector.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type Hold = {
  x: number;
  y: number;
  radius: number; // normalized 0-1 (fraction of image width)
  type: HoldType;
};

export type SplinePoint = {
  x: number;
  y: number;
};

export type Climb = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    name: string;
    grade: ClimbGrade;
    description?: string;
    holds: Hold[];
    spline: SplinePoint[];

    /* References */
    image: WithDepopulatedOwnership<Image>;
    location: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
      sectors: string[];
    };
    sector: Omit<WithDepopulatedOwnership<Sector>, 'climbs'> & {
      climbs: string[];
    };
  }>
>;
