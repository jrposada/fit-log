import { Image } from '../image/image';
import { Location } from '../location/location';
import { Sector } from '../sector/sector';

export type ClimbGrade =
  | 'V0'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6'
  | 'V7'
  | 'V8'
  | 'V9'
  | 'V10'
  | 'V11'
  | 'V12'
  | 'V13'
  | 'V14'
  | 'V15'
  | 'V16'
  | 'V17'
  | (string & {});

export const DEFAULT_HOLD_RADIUS = 0.03;

export type Hold = {
  x: number;
  y: number;
  radius: number; // normalized 0-1 (fraction of image width)
};

export type SplinePoint = {
  x: number;
  y: number;
};

export type Climb = {
  /* Data */
  id: string;
  name: string;
  grade: ClimbGrade;
  description?: string;
  holds: Hold[];
  spline: SplinePoint[];

  /* References */
  image: Image;
  location: Omit<Location, 'sectors'> & { sectors: string[] };
  sector: Omit<Sector, 'climbs'> & {
    climbs: string[];
  };

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
