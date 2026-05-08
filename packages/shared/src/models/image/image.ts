import { WithOwnership } from '../auth/with-ownership';
import { WithTimestamps } from '../utils/with-timestamps';

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
