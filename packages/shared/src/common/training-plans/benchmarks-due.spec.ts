import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { benchmarksDue } from './benchmarks-due.ts';

const plan = loadSeedTrainingPlan();

function dueIds(week: number) {
  return benchmarksDue(plan, week).map((benchmark) => benchmark.id);
}

describe('benchmarksDue', () => {
  it('includes baseline benchmarks before the start', () => {
    const ids = dueIds(0);

    expect(ids).toContain('open_hand_mvc');
    expect(ids).toContain('bodyweight');
    expect(ids).not.toContain('limit_grade');
  });

  it('includes only project progress in week 9', () => {
    expect(dueIds(9)).toEqual(['project_progress']);
  });

  it('is empty in a week without retests', () => {
    expect(dueIds(5)).toEqual([]);
  });
});
