import z from 'zod';

import { BenchmarkResult } from './benchmark-result.ts';

export type BenchmarkResultsPutRequest = Pick<
  BenchmarkResult,
  'enrollment' | 'benchmarkId' | 'date' | 'value' | 'notes'
> & {
  id?: string;
};

export const benchmarkResultsPutRequestSchema = z.object({
  id: z.string().optional(),
  enrollment: z.string().nonempty(),
  benchmarkId: z.string().nonempty(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.union([z.number(), z.string()]),
  notes: z.string().optional(),
});

export type BenchmarkResultsPutResponse = {
  benchmarkResult: BenchmarkResult;
};
