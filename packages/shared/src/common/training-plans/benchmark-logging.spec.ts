import { describe, expect, it } from 'vitest';

import {
  benchmarkResultPutRequest,
  benchmarkResultsByBenchmark,
  parseBenchmarkValue,
} from './benchmark-logging.ts';

describe('parseBenchmarkValue', () => {
  it('parses a kg value, accepting a decimal comma', () => {
    expect(parseBenchmarkValue('kg', ' 101,5 ')).toBe(101.5);
  });

  it('accepts a negative kg value (assisted)', () => {
    expect(parseBenchmarkValue('kg', '-10')).toBe(-10);
  });

  it('parses minutes', () => {
    expect(parseBenchmarkValue('minutes', '12.5')).toBe(12.5);
  });

  it('parses whole rounds', () => {
    expect(parseBenchmarkValue('rounds', '3')).toBe(3);
  });

  it.each([
    ['kg', ''],
    ['kg', '   '],
    ['kg', 'abc'],
    ['kg', 'Infinity'],
    ['rounds', '2.5'],
    ['rounds', '-1'],
    ['minutes', '-1'],
  ] as const)('rejects %s %j', (unit, text) => {
    expect(parseBenchmarkValue(unit, text)).toBeUndefined();
  });

  it('keeps a trimmed v_grade or text value as a string', () => {
    expect(parseBenchmarkValue('v_grade', ' V5 ')).toBe('V5');
    expect(parseBenchmarkValue('text', '3 of 4 sections')).toBe(
      '3 of 4 sections'
    );
  });

  it('keeps a numeric-looking v_grade as a string', () => {
    expect(parseBenchmarkValue('v_grade', '5')).toBe('5');
  });

  it('rejects an empty v_grade or text value', () => {
    expect(parseBenchmarkValue('v_grade', '  ')).toBeUndefined();
    expect(parseBenchmarkValue('text', '')).toBeUndefined();
  });
});

describe('benchmarkResultPutRequest', () => {
  const base = {
    enrollment: 'enrollment-1',
    date: '2026-10-24',
    notes: '',
  };

  it('builds a numeric request without empty notes', () => {
    expect(
      benchmarkResultPutRequest({
        ...base,
        benchmark: { id: 'open_hand_mvc', unit: 'kg' },
        valueText: '95.5',
      })
    ).toEqual({
      enrollment: 'enrollment-1',
      benchmarkId: 'open_hand_mvc',
      date: '2026-10-24',
      value: 95.5,
    });
  });

  it('builds a string request with trimmed notes', () => {
    expect(
      benchmarkResultPutRequest({
        ...base,
        benchmark: { id: 'limit_grade', unit: 'v_grade' },
        valueText: 'V6',
        notes: '  flashed  ',
      })
    ).toEqual({
      enrollment: 'enrollment-1',
      benchmarkId: 'limit_grade',
      date: '2026-10-24',
      value: 'V6',
      notes: 'flashed',
    });
  });

  it('is undefined for an invalid value', () => {
    expect(
      benchmarkResultPutRequest({
        ...base,
        benchmark: { id: 'open_hand_mvc', unit: 'kg' },
        valueText: 'V6',
      })
    ).toBeUndefined();
  });
});

describe('benchmarkResultsByBenchmark', () => {
  const result = (
    id: string,
    benchmarkId: string,
    date: string,
    createdAt: string
  ) => ({ id, benchmarkId, date, createdAt });

  it('groups results per benchmark, newest first', () => {
    const grouped = benchmarkResultsByBenchmark([
      result('a', 'open_hand_mvc', '2026-10-24', '2026-10-24T10:00:00.000Z'),
      result('b', 'bodyweight', '2026-10-24', '2026-10-24T10:00:00.000Z'),
      result('c', 'open_hand_mvc', '2026-11-21', '2026-11-21T10:00:00.000Z'),
      result('d', 'open_hand_mvc', '2026-10-24', '2026-10-25T09:00:00.000Z'),
    ]);

    expect(grouped.get('open_hand_mvc')?.map(({ id }) => id)).toEqual([
      'c',
      'd',
      'a',
    ]);
    expect(grouped.get('bodyweight')?.map(({ id }) => id)).toEqual(['b']);
    expect(grouped.get('crimp_mvc')).toBeUndefined();
  });
});
