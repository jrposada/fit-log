import { WithOwnership } from '../auth/with-ownership';
import { WithTimestamps } from '../utils/with-timestamps';

export type Model3D = WithOwnership<
  WithTimestamps<{
    id: string;
    modelUrl: string;
    fileSize: number;
  }>
>;
