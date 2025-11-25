export type LocationDbRecord = {
  PK: 'location';

  /** location#<location-id> */
  SK: `location#${string}`;

  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  placeName?: string;
  placeId?: string;
  lastUsedAt?: string;
  createdAt: string;
};
