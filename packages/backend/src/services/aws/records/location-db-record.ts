export type LocationDbRecord = {
  PK: 'location';

  /** location#<location-id> */
  SK: `location#${string}`;

  name: string;
  createdAt: string;
};
