import { WithOwnership } from '../auth/with-ownership.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type Image = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    imageUrl: string;
    thumbnailUrl: string;
    imageWidth: number;
    imageHeight: number;
  }>
>;
