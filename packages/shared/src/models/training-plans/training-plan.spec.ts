import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlanJson } from '../../test-utils/seed-training-plan.ts';
import { normalizeTrainingPlanJson } from './normalize-training-plan-json.ts';
import { TrainingPlan, trainingPlanSchema } from './training-plan.ts';

function normalizedSeed(): TrainingPlan {
  return normalizeTrainingPlanJson(loadSeedTrainingPlanJson()) as TrainingPlan;
}

function issuePaths(plan: TrainingPlan) {
  const result = trainingPlanSchema.safeParse(plan);
  expect(result.success).toBe(false);
  return result.error?.issues.map((issue) => issue.path) ?? [];
}

describe('trainingPlanSchema', () => {
  it('parses the normalized seed plan', () => {
    const result = trainingPlanSchema.safeParse(normalizedSeed());

    expect(result.error?.issues).toBeUndefined();
    expect(result.data?.exercises).toHaveLength(46);
    expect(result.data?.sessionTemplates).toHaveLength(20);
    expect(result.data?.blocks).toHaveLength(6);
  });

  it('normalizes ranges, prescriptions and the weekly schedule', () => {
    const plan = trainingPlanSchema.parse(normalizedSeed());
    const limitBoulder = plan.sessionTemplates
      .find((template) => template.id === 'b1_thu_limit_boulder')
      ?.items.find((item) => item.order === 2);

    expect(plan.id).toBe('boulder-v6-v7-12wk');
    expect(plan.durationWeeks).toBe(12);
    expect(limitBoulder).toEqual({
      order: 2,
      section: 'main',
      exerciseId: 'limit_bouldering',
      prescription: {
        reps: { min: 6, max: 8 },
        unit: 'problems',
        intensity: 'V4-V5+ on Kilter, 0-4 moves each',
        restS: { min: 180, max: 300 },
        durationMin: 45,
        notes: '45 min max. Slopers and compression only.',
      },
    });
    expect(plan.schedule[0]).toEqual({
      blockId: 'block1',
      day: 1,
      slot: 'pm',
      sessionTemplateId: 'b1_mon_technique_arc',
    });
    expect(plan.tindeq.loadPrescription[2]).toEqual({
      exerciseId: 'max_hangs_open_hand',
      blockId: 'block3',
      percentOfMvc: [85, 85],
      notes: 'maintenance',
    });
  });

  it('rejects an item with an unknown exercise', () => {
    const plan = normalizedSeed();
    plan.sessionTemplates[0]!.items[0]!.exerciseId = 'unknown';

    expect(issuePaths(plan)).toContainEqual([
      'sessionTemplates',
      0,
      'items',
      0,
      'exerciseId',
    ]);
  });

  it('rejects a schedule entry with an unknown session template', () => {
    const plan = normalizedSeed();
    plan.schedule[0]!.sessionTemplateId = 'unknown';

    expect(issuePaths(plan)).toContainEqual([
      'schedule',
      0,
      'sessionTemplateId',
    ]);
  });

  it('rejects a week not covered by any block', () => {
    const plan = normalizedSeed();
    for (const block of plan.blocks) {
      block.weeks = block.weeks.filter((week) => week !== 4);
    }

    expect(issuePaths(plan)).toContainEqual(['blocks']);
  });

  it('rejects a week covered by more than one block', () => {
    const plan = normalizedSeed();
    plan.blocks[0]!.weeks.push(4);

    const paths = issuePaths(plan);
    expect(paths).toContainEqual(['blocks', 0, 'weeks', 3]);
    expect(paths).toContainEqual(['blocks', 1, 'weeks', 0]);
  });

  it('rejects duplicate exercise ids', () => {
    const plan = normalizedSeed();
    plan.exercises.push({ ...plan.exercises[0]! });

    expect(issuePaths(plan)).toContainEqual(['exercises', 46, 'id']);
  });
});
