export type ClimbDbRecord = {
  PK: 'climb';

  /** climb#<user-id>#<climb-id> */
  SK: `climb#${string}#${string}`;

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
