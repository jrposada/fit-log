import z from 'zod';

export type SectorsBatchDeleteRequest = {
  ids: string[];
};
export const sectorsBatchDeleteRequestSchema = z.object({
  ids: z.array(z.string().nonempty()).min(1),
});

export type SectorsBatchDeleteResponse = {
  deletedCount: number;
};
