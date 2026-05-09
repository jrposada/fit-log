import {
  WithDepopulatedOwnership,
  WithOwnership,
} from '../auth/with-ownership';
import { Image } from '../image/image';
import { Location } from '../location/location';
import { Sector } from '../sector/sector';
import { WithTimestamps } from '../utils/with-timestamps';

export const GRADE_OPTIONS = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
] as const;
export type ClimbGrade = typeof GRADE_OPTIONS[number] | (string & {});

export const DEFAULT_HOLD_RADIUS = 0.03;

export const HOLD_TYPES = ['normal', 'start', 'end', 'feet-only'] as const;
export type HoldType = typeof HOLD_TYPES[number];

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
