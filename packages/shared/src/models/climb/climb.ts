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

export type Hold = {
  x: number;
  y: number;
};

export type Climb = {
  /* Data */
  id: string;
  name: string;
  grade: string;
  description?: string;
  holds: Hold[];

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
