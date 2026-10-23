import { describe, expect, it } from 'vitest';

import { latestBenchmarkValue } from './latest-benchmark-value.ts';

const result = (benchmarkId: string, date: string, value: number | string) => ({
  benchmarkId,
  date,
  value,
});

describe('latestBenchmarkValue', () => {
  it('is the value of the most recent result of the benchmark', () => {
    expect(
      latestBenchmarkValue(
        [
          result('open_hand_mvc', '2026-10-24', 95),
          result('open_hand_mvc', '2026-11-21', 101.5),
          result('bodyweight', '2026-12-01', 70),
          result('open_hand_mvc', '2026-11-01', 98),
        ],
        'open_hand_mvc'
      )
    ).toBe(101.5);
  });

  it('is undefined without results', () => {
    expect(
      latestBenchmarkValue(
        [result('bodyweight', '2026-10-24', 70)],
        'open_hand_mvc'
      )
    ).toBeUndefined();
  });

  it('is undefined for a non-numeric value', () => {
    expect(
      latestBenchmarkValue(
        [result('limit_grade', '2026-10-24', 'V5')],
        'limit_grade'
      )
    ).toBeUndefined();
  });
});
