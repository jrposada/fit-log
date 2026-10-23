import { BenchmarkResult } from '../../models/benchmark-results/benchmark-result.ts';

/** Numeric value of the most recent result of `benchmarkId`. */
export function latestBenchmarkValue(
  results: Pick<BenchmarkResult, 'benchmarkId' | 'date' | 'value'>[],
  benchmarkId: string
): number | undefined {
  // `YYYY-MM-DD` dates sort chronologically as strings.
  const latest = results
    .filter((result) => result.benchmarkId === benchmarkId)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return typeof latest?.value === 'number' ? latest.value : undefined;
}
