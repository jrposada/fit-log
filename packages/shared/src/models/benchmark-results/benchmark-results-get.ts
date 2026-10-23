import z from 'zod';

import { BenchmarkResult } from './benchmark-result.ts';

export type BenchmarkResultsGetQuery = {
  enrollment: string;
};
export const benchmarkResultsGetQuerySchema = z.object({
  enrollment: z.string().nonempty(),
});

export type BenchmarkResultsGetResponse = {
  benchmarkResults: BenchmarkResult[];
};
