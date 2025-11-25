export type SectorDbRecord = {
  PK: 'sector';

  /** sector#<location-id>#<sector-id> */
  SK: `sector#${string}#${string}`;

  name: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageFileSize: number;
  sortOrder: number;
  isPrimary?: boolean;
  createdAt: string;
};
