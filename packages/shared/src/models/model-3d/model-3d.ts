import { Model3dStatus } from '../../common/model-3d/model-3d-statuses.ts';
import { WithOwnership } from '../auth/with-ownership.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

export type Model3d = WithOwnership<
  WithTimestamps<{
    /* Data */
    id: string;
    /** 'processing' while a video-sourced reconstruction job is running. */
    status: Model3dStatus;
    /** Set once `status` is 'ready'. */
    modelUrl?: string;
    mimeType?: string;
    fileSize?: number;
    /** Set once `status` is 'failed'. */
    error?: string;
  }>
>;
