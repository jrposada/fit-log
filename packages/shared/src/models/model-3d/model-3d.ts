import { WithOwnership } from '../auth/with-ownership.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type Model3d = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    modelUrl: string;
    mimeType: string;
    fileSize: number;
  }>
>;
