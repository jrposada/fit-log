import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { resolvePrescription, weekInBlock } from './resolve-prescription.ts';

const plan = loadSeedTrainingPlan();
const block1 = plan.blocks.find((block) => block.id === 'block1')!;
const block2 = plan.blocks.find((block) => block.id === 'block2')!;

function findItem(templateId: string, exerciseId: string) {
  return plan.sessionTemplates
    .find((template) => template.id === templateId)!
    .items.find((item) => item.exerciseId === exerciseId)!;
}

describe('weekInBlock', () => {
  it('is the 1-based position of the week in the block', () => {
    expect(weekInBlock(block2, 5)).toBe(1);
    expect(weekInBlock(block2, 7)).toBe(3);
  });

  it('throws for a week outside the block', () => {
    expect(() => weekInBlock(block2, 4)).toThrow();
  });
});

describe('resolvePrescription', () => {
  it('takes sets from setsByWeek for each week of the block', () => {
    const repeaters = findItem('b1_tue_hangboard_pull', 'open_hand_repeaters');

    expect(resolvePrescription(repeaters, block1, 1).sets).toBe(3);
    expect(resolvePrescription(repeaters, block1, 2).sets).toBe(4);
    expect(resolvePrescription(repeaters, block1, 3).sets).toBe(5);
  });

  it('returns a prescription without setsByWeek unchanged', () => {
    const hollowBody = findItem('b1_mon_technique_arc', 'hollow_body_hold');

    expect(resolvePrescription(hollowBody, block1, 2)).toEqual(
      hollowBody.prescription
    );
  });

  it('preserves ranges', () => {
    const limitBoulder = findItem('b1_thu_limit_boulder', 'limit_bouldering');

    expect(resolvePrescription(limitBoulder, block1, 1).reps).toEqual({
      min: 6,
      max: 8,
    });
  });
});
