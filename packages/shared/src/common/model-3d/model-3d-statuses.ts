export const MODEL_3D_STATUSES = ['ready', 'processing', 'failed'] as const;
export type Model3dStatus = (typeof MODEL_3D_STATUSES)[number];
