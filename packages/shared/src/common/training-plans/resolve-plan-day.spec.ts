import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { resolvePlanDay } from './resolve-plan-day.ts';

const plan = loadSeedTrainingPlan();
const START = '2026-10-26';

function addDays(date: string, days: number): string {
  const time = Date.parse(date) + days * 24 * 60 * 60 * 1000;
  return new Date(time).toISOString().slice(0, 10);
}

describe('resolvePlanDay', () => {
  it('is before the plan the day before the start', () => {
    expect(resolvePlanDay(plan, START, '2026-10-25')).toEqual({
      status: 'before',
    });
  });

  it('resolves the first day', () => {
    const day = resolvePlanDay(plan, START, START);

    expect(day).toMatchObject({ status: 'active', week: 1, day: 1 });
    expect(day.status === 'active' && day.block.id).toBe('block1');
    expect(day.status === 'active' && day.entries).toEqual([
      {
        blockId: 'block1',
        day: 1,
        slot: 'pm',
        sessionTemplateId: 'b1_mon_technique_arc',
      },
    ]);
  });

  it('starts week 2 on the second Monday', () => {
    expect(resolvePlanDay(plan, START, '2026-11-02')).toMatchObject({
      status: 'active',
      week: 2,
      day: 1,
    });
  });

  it('resolves week 4 to the deload block', () => {
    const day = resolvePlanDay(plan, START, addDays(START, 21));

    expect(day).toMatchObject({ status: 'active', week: 4, day: 1 });
    expect(day.status === 'active' && day.block.id).toBe('deload1');
  });

  it('resolves the last Sunday as week 12 day 7', () => {
    const day = resolvePlanDay(plan, START, addDays(START, 83));

    expect(day).toMatchObject({ status: 'active', week: 12, day: 7 });
    expect(day.status === 'active' && day.block.id).toBe('send');
  });

  it('is after the plan the day after the last Sunday', () => {
    expect(resolvePlanDay(plan, START, addDays(START, 84))).toEqual({
      status: 'after',
    });
  });

  it('carries block-specific notes on a reused template', () => {
    const day = resolvePlanDay(plan, START, addDays(START, 4 * 7 + 4));

    expect(day).toMatchObject({ status: 'active', week: 5, day: 5 });
    expect(day.status === 'active' && day.entries).toContainEqual({
      blockId: 'block2',
      day: 5,
      slot: 'am',
      sessionTemplateId: 'gym_b',
      notes: 'Add 1-2 kg when all reps are clean.',
    });
  });
});
