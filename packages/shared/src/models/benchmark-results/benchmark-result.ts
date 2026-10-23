import { WithTimestamps } from '../utils/with-timestamps.ts';

export type BenchmarkResult = WithTimestamps<{
  /* Data */
  id: string;
  enrollment: string;
  /** Benchmark id within the enrollment's plan. */
  benchmarkId: string;
  /** `YYYY-MM-DD` calendar date. */
  date: string;
  /** Plan week derived from `date`; week 0 is before the plan starts. */
  week: number;
  /** A string for `v_grade`/`text` benchmarks, a number otherwise. */
  value: number | string;
  notes?: string;

  /* Ownership */
  owner: string;
}>;
