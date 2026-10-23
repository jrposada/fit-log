import z from 'zod';

export type BenchmarkResultsDeleteParams = {
  id: string;
};
export const benchmarkResultsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type BenchmarkResultsDeleteResponse = undefined;
