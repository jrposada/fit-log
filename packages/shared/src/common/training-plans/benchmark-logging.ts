import { BenchmarkResult } from '../../models/benchmark-results/benchmark-result.ts';
import { BenchmarkResultsPutRequest } from '../../models/benchmark-results/benchmark-results-put.ts';
import {
  TrainingPlanBenchmark,
  TrainingPlanBenchmarkUnit,
} from '../../models/training-plans/training-plan.ts';

/** Parses a benchmark value input, `undefined` when empty or not a valid
 * value for `unit`. `v_grade`/`text` values stay strings. */
export function parseBenchmarkValue(
  unit: TrainingPlanBenchmarkUnit,
  text: string
): number | string | undefined {
  const trimmed = text.trim();
  if (trimmed === '') {
    return undefined;
  }
  if (unit === 'v_grade' || unit === 'text') {
    return trimmed;
  }

  const value = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(value)) {
    return undefined;
  }

  switch (unit) {
    // Negative load is an assisted result (e.g. pulley-assisted pull-up).
    case 'kg':
      return value;
    case 'rounds':
      return Number.isInteger(value) && value >= 0 ? value : undefined;
    case 'minutes':
      return value >= 0 ? value : undefined;
  }
}

type BenchmarkResultPutRequestParams = {
  enrollment: string;
  benchmark: Pick<TrainingPlanBenchmark, 'id' | 'unit'>;
  /** `YYYY-MM-DD` */
  date: string;
  valueText: string;
  notes: string;
};

/** Request that logs a benchmark result, `undefined` when the value is not
 * valid for the benchmark's unit. */
export function benchmarkResultPutRequest({
  enrollment,
  benchmark,
  date,
  valueText,
  notes,
}: BenchmarkResultPutRequestParams): BenchmarkResultsPutRequest | undefined {
  const value = parseBenchmarkValue(benchmark.unit, valueText);
  if (value === undefined) {
    return undefined;
  }

  const trimmedNotes = notes.trim();
  return {
    enrollment,
    benchmarkId: benchmark.id,
    date,
    value,
    ...(trimmedNotes !== '' && { notes: trimmedNotes }),
  };
}

/** Results grouped by benchmark id, newest first. */
export function benchmarkResultsByBenchmark<
  T extends Pick<BenchmarkResult, 'benchmarkId' | 'date' | 'createdAt'>,
>(results: T[]): Map<string, T[]> {
  // `YYYY-MM-DD` and ISO timestamps sort chronologically as strings.
  const sorted = [...results].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
  );

  const grouped = new Map<string, T[]>();
  for (const result of sorted) {
    grouped.set(result.benchmarkId, [
      ...(grouped.get(result.benchmarkId) ?? []),
      result,
    ]);
  }
  return grouped;
}
