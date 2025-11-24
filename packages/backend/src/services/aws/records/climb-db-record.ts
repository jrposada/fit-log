export type ClimbDbRecord = {
  PK: 'climb';

  /** climb#<climb-id> */
  SK: `climb#${string}`;

  /** location#<location-id> */
  location: `location#${string}`;

  holds: Hold[];
  name: string;
  grade: string;
  description?: string;
  sector?: string;
  createdAt: string;
};

type Hold = {
  x: number;
  y: number;
};
