export type ClimbDbRecord = {
  PK: 'climb';

  /** climb#<user-id>#<climb-id> */
  SK: `climb#${string}#${string}`;

  holds: Hold[];
  name: string;
  description?: string;
  createdAt: string;
};

type Hold = {
  x: number;
  y: number;
};
