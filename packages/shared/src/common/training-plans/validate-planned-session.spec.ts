import { describe, expect, it } from 'vitest';

import { TrainingSessionItemLog } from '../../models/training-sessions/training-session.ts';
import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { validatePlannedSession } from './validate-planned-session.ts';

const plan = loadSeedTrainingPlan();

const GYM_A = {
  sessionTemplateId: 'gym_a_b1',
  week: 1,
  day: 2,
  slot: 'am',
} as const;

function itemLog(
  itemOrder: number,
  exerciseId: string
): TrainingSessionItemLog {
  return { itemOrder, exerciseId, status: 'done', sets: [] };
}

describe('validatePlannedSession', () => {
  it('accepts a scheduled gym session with matching item logs', () => {
    expect(
      validatePlannedSession(plan, GYM_A, 'gym', [
        itemLog(1, 'general_gym_warmup'),
        itemLog(2, 'goblet_squat'),
      ])
    ).toBeNull();
  });

  it('accepts a scheduled climbing session without item logs', () => {
    expect(
      validatePlannedSession(
        plan,
        {
          sessionTemplateId: 'b1_mon_technique_arc',
          week: 1,
          day: 1,
          slot: 'pm',
        },
        'climbing',
        []
      )
    ).toBeNull();
  });

  it('accepts a template reused in a later block', () => {
    expect(
      validatePlannedSession(
        plan,
        { sessionTemplateId: 'gym_b', week: 10, day: 5, slot: 'am' },
        'gym',
        []
      )
    ).toBeNull();
  });

  it.each([0, 13])('rejects week %i outside the plan', (week) => {
    expect(validatePlannedSession(plan, { ...GYM_A, week }, 'gym', [])).toMatch(
      `Week ${week}`
    );
  });

  it('rejects a template not scheduled in the block of the week', () => {
    expect(
      validatePlannedSession(plan, { ...GYM_A, week: 4 }, 'gym', [])
    ).toMatch('gym_a_b1');
  });

  it('rejects a template scheduled on another day', () => {
    expect(
      validatePlannedSession(plan, { ...GYM_A, day: 3 }, 'gym', [])
    ).toMatch('gym_a_b1');
  });

  it('rejects a template scheduled in another slot', () => {
    expect(
      validatePlannedSession(plan, { ...GYM_A, slot: 'pm' }, 'gym', [])
    ).toMatch('gym_a_b1');
  });

  it('rejects a sport that does not match the template type', () => {
    expect(validatePlannedSession(plan, GYM_A, 'climbing', [])).toMatch('gym');
  });

  it('rejects an item order not in the template', () => {
    expect(
      validatePlannedSession(plan, GYM_A, 'gym', [itemLog(99, 'goblet_squat')])
    ).toMatch('99');
  });

  it('rejects an exercise that does not match the item order', () => {
    expect(
      validatePlannedSession(plan, GYM_A, 'gym', [itemLog(2, 'pushup')])
    ).toMatch('pushup');
  });

  it('rejects an item order logged twice', () => {
    expect(
      validatePlannedSession(plan, GYM_A, 'gym', [
        itemLog(2, 'goblet_squat'),
        itemLog(2, 'goblet_squat'),
      ])
    ).toMatch('Item 2');
  });
});
