import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { hangLoad, hasHangLoad } from './hang-load.ts';

const plan = loadSeedTrainingPlan();

describe('hangLoad', () => {
  it('derives total and added load from MVC and bodyweight', () => {
    expect(hangLoad(plan, 'open_hand_repeaters', 'block1', 100, 70)).toEqual({
      percent: { min: 60, max: 70 },
      totalKg: { min: 60, max: 70 },
      addedKg: { min: -10, max: 0 },
    });
  });

  it('prefers the block-specific prescription', () => {
    expect(
      hangLoad(plan, 'max_hangs_open_hand', 'block3', 100)?.percent
    ).toEqual({ min: 85, max: 85 });
  });

  it('falls back to the generic prescription', () => {
    expect(
      hangLoad(plan, 'max_hangs_open_hand', 'block2', 100)?.percent
    ).toEqual({ min: 85, max: 90 });
  });

  it('rounds totals to 0.5 kg', () => {
    expect(
      hangLoad(plan, 'open_hand_repeaters', 'block1', 101.3)?.totalKg
    ).toEqual({ min: 61, max: 71 });
  });

  it('omits added load without bodyweight', () => {
    expect(
      hangLoad(plan, 'open_hand_repeaters', 'block1', 100)
    ).not.toHaveProperty('addedKg');
  });

  it('is null for an exercise without a load prescription', () => {
    expect(hangLoad(plan, 'pushup', 'block1', 100, 70)).toBeNull();
  });
});

describe('hasHangLoad', () => {
  it('is true for an exercise with a load prescription', () => {
    expect(hasHangLoad(plan, 'open_hand_repeaters')).toBe(true);
  });

  it('is false for any other exercise', () => {
    expect(hasHangLoad(plan, 'weighted_pullup')).toBe(false);
  });
});
