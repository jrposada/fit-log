export type BoulderDbRecord = {
  PK: 'boulder';

  /** boulder#<user-id>#<boulder-id> */
  SK: `boulder#${string}#${string}`;

  image: string;
  holds: Hold[];
  name: string;
  description?: string;
  createdAt: string;
};

type Hold = {
  x: number;
  y: number;
};
