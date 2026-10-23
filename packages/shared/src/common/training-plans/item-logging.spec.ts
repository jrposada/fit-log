import { describe, expect, it } from 'vitest';

import { TrainingSessionItemLog } from '../../models/training-sessions/training-session.ts';
import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import {
  defaultSetCount,
  latestLoggedSets,
  parseSetValue,
  prefillSets,
  removeItemLog,
  setItemLog,
  toggleItemLogStatus,
  updateItemLogSets,
  visibleSetFields,
} from './item-logging.ts';
import { resolvePrescription } from './resolve-prescription.ts';

const plan = loadSeedTrainingPlan();

function itemOf(templateId: string, exerciseId: string, week = 1) {
  const template = plan.sessionTemplates.find(({ id }) => id === templateId)!;
  const item = template.items.find(
    (candidate) => candidate.exerciseId === exerciseId
  )!;
  const block = plan.blocks.find(({ weeks }) => weeks.includes(week))!;
  return {
    plan,
    template,
    item,
    prescription: resolvePrescription(item, block, week),
  };
}

describe('visibleSetFields', () => {
  it('shows reps and weight for a gym item', () => {
    expect(visibleSetFields(itemOf('gym_a_b1', 'goblet_squat'))).toEqual([
      'reps',
      'weightKg',
      'rpe',
    ]);
  });

  it('shows reps for max reps', () => {
    expect(visibleSetFields(itemOf('gym_a_b1', 'pushup'))).toEqual([
      'reps',
      'weightKg',
    ]);
  });

  it('shows weight for a load hint on a climb template', () => {
    expect(
      visibleSetFields(itemOf('b1_tue_hangboard_pull', 'weighted_pullup'))
    ).toEqual(['reps', 'weightKg']);
  });

  it('shows weight for a Tindeq item and hold for on/off', () => {
    expect(
      visibleSetFields(itemOf('b1_tue_hangboard_pull', 'open_hand_repeaters'))
    ).toEqual(['reps', 'weightKg', 'holdS']);
  });

  it('shows hold without weight on a climb template', () => {
    expect(
      visibleSetFields(itemOf('b1_mon_technique_arc', 'hollow_body_hold'))
    ).toEqual(['holdS']);
  });

  it('shows duration', () => {
    expect(visibleSetFields(itemOf('b1_mon_technique_arc', 'arc'))).toEqual([
      'durationMin',
    ]);
  });

  it('shows nothing for a text-only prescription', () => {
    expect(
      visibleSetFields(itemOf('optional_easy_climb', 'easy_climbing'))
    ).toEqual([]);
  });
});

describe('defaultSetCount', () => {
  it('is the effective sets of the week', () => {
    expect(
      defaultSetCount(
        itemOf('b1_tue_hangboard_pull', 'open_hand_repeaters', 2).prescription
      )
    ).toBe(4);
  });

  it('is the minimum of a range', () => {
    expect(
      defaultSetCount(
        itemOf('b2_mon_heavy_hang_pull', 'max_hangs_open_hand', 5).prescription
      )
    ).toBe(5);
  });

  it('is 1 without sets', () => {
    expect(
      defaultSetCount(
        itemOf('b1_mon_technique_arc', 'silent_feet').prescription
      )
    ).toBe(1);
  });
});

describe('prefillSets', () => {
  it('fills prescribed values for each set', () => {
    const { prescription } = itemOf(
      'b1_tue_hangboard_pull',
      'open_hand_repeaters'
    );

    expect(
      prefillSets(prescription, ['reps', 'weightKg', 'holdS'], [])
    ).toEqual([
      { reps: 6, holdS: 7 },
      { reps: 6, holdS: 7 },
      { reps: 6, holdS: 7 },
    ]);
  });

  it('takes the minimum of ranges', () => {
    const { prescription } = itemOf('b1_thu_limit_boulder', 'limit_bouldering');

    expect(prefillSets(prescription, ['reps', 'durationMin'], [])).toEqual([
      { reps: 6, durationMin: 45 },
    ]);
  });

  it('fills unprescribed fields from the previous sets by position', () => {
    const { prescription } = itemOf('gym_a_b1', 'goblet_squat');

    expect(
      prefillSets(
        prescription,
        ['reps', 'weightKg', 'rpe'],
        [
          { reps: 11, weightKg: 20, rpe: 8 },
          { reps: 12, weightKg: 22.5 },
        ]
      )
    ).toEqual([
      { reps: 12, weightKg: 20, rpe: 7 },
      { reps: 12, weightKg: 22.5, rpe: 7 },
      { reps: 12, weightKg: 22.5, rpe: 7 },
    ]);
  });

  it('fills max reps from the previous sets', () => {
    const { prescription } = itemOf('gym_a_b1', 'pushup');

    expect(
      prefillSets(prescription, ['reps', 'weightKg'], [{ reps: 18 }])
    ).toEqual([{ reps: 18 }, { reps: 18 }]);
  });

  it('ignores previous values of hidden fields', () => {
    const { prescription } = itemOf('b1_mon_technique_arc', 'hollow_body_hold');

    expect(
      prefillSets(prescription, ['holdS'], [{ holdS: 25, weightKg: 5 }])
    ).toEqual([{ holdS: 20 }, { holdS: 20 }, { holdS: 20 }]);
  });
});

describe('latestLoggedSets', () => {
  const log = (
    exerciseId: string,
    sets: TrainingSessionItemLog['sets'],
    status: TrainingSessionItemLog['status'] = 'done'
  ): TrainingSessionItemLog => ({ itemOrder: 1, exerciseId, status, sets });

  it('returns the sets of the most recent session that logged the exercise', () => {
    const sessions = [
      {
        id: 'old',
        startedAt: '2026-10-27T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [{ reps: 15, weightKg: 8 }])],
      },
      {
        id: 'newer',
        startedAt: '2026-11-03T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [{ reps: 15, weightKg: 10 }])],
      },
      {
        id: 'newest-other',
        startedAt: '2026-11-05T18:00:00.000Z',
        itemLogs: [log('plank', [{ holdS: 30 }])],
      },
    ];

    expect(latestLoggedSets(sessions, 'wrist_curl', 'current')).toEqual([
      { reps: 15, weightKg: 10 },
    ]);
  });

  it('skips the current session, skipped logs and empty sets', () => {
    const sessions = [
      {
        id: 'done',
        startedAt: '2026-10-27T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [{ reps: 12 }])],
      },
      {
        id: 'empty',
        startedAt: '2026-10-28T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [])],
      },
      {
        id: 'skipped',
        startedAt: '2026-10-29T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [{ reps: 1 }], 'skipped')],
      },
      {
        id: 'current',
        startedAt: '2026-10-30T18:00:00.000Z',
        itemLogs: [log('wrist_curl', [{ reps: 99 }])],
      },
    ];

    expect(latestLoggedSets(sessions, 'wrist_curl', 'current')).toEqual([
      { reps: 12 },
    ]);
  });

  it('is empty when the exercise was never logged', () => {
    expect(latestLoggedSets([], 'wrist_curl', 'current')).toEqual([]);
  });
});

describe('setItemLog / removeItemLog', () => {
  const a: TrainingSessionItemLog = {
    itemOrder: 2,
    exerciseId: 'a',
    status: 'done',
    sets: [],
  };
  const b: TrainingSessionItemLog = {
    itemOrder: 5,
    exerciseId: 'b',
    status: 'skipped',
    sets: [],
  };

  it('adds a log in item order', () => {
    expect(setItemLog([b], a)).toEqual([a, b]);
  });

  it('replaces the log of the same item', () => {
    const updated = { ...a, sets: [{ reps: 3 }] };
    expect(setItemLog([a, b], updated)).toEqual([updated, b]);
  });

  it('removes the log of an item', () => {
    expect(removeItemLog([a, b], 2)).toEqual([b]);
  });
});

describe('toggleItemLogStatus', () => {
  const item = { order: 3, exerciseId: 'goblet_squat' };
  const sets = [{ reps: 12, weightKg: 20 }];

  it('marks an unlogged item done with the given sets', () => {
    expect(toggleItemLogStatus([], item, 'done', sets)).toEqual([
      { itemOrder: 3, exerciseId: 'goblet_squat', status: 'done', sets },
    ]);
  });

  it('marks an item skipped without sets, keeping notes', () => {
    expect(
      toggleItemLogStatus(
        [
          {
            itemOrder: 3,
            exerciseId: 'goblet_squat',
            status: 'done',
            notes: 'knee',
            sets,
          },
        ],
        item,
        'skipped',
        sets
      )
    ).toEqual([
      {
        itemOrder: 3,
        exerciseId: 'goblet_squat',
        status: 'skipped',
        notes: 'knee',
        sets: [],
      },
    ]);
  });

  it('clears the log when toggling its current status', () => {
    expect(
      toggleItemLogStatus(
        [{ itemOrder: 3, exerciseId: 'goblet_squat', status: 'done', sets }],
        item,
        'done',
        sets
      )
    ).toEqual([]);
  });
});

describe('updateItemLogSets', () => {
  const item = { order: 3, exerciseId: 'goblet_squat' };

  it('marks an unlogged item done', () => {
    expect(updateItemLogSets([], item, [{ reps: 10 }])).toEqual([
      {
        itemOrder: 3,
        exerciseId: 'goblet_squat',
        status: 'done',
        sets: [{ reps: 10 }],
      },
    ]);
  });

  it('replaces the sets of a logged item', () => {
    expect(
      updateItemLogSets(
        [
          {
            itemOrder: 3,
            exerciseId: 'goblet_squat',
            status: 'done',
            notes: 'n',
            sets: [{ reps: 10 }],
          },
        ],
        item,
        [{ reps: 10 }, { reps: 8 }]
      )
    ).toEqual([
      {
        itemOrder: 3,
        exerciseId: 'goblet_squat',
        status: 'done',
        notes: 'n',
        sets: [{ reps: 10 }, { reps: 8 }],
      },
    ]);
  });
});

describe('parseSetValue', () => {
  it('is undefined for empty or non-numeric text', () => {
    expect(parseSetValue('reps', '')).toBeUndefined();
    expect(parseSetValue('reps', '  ')).toBeUndefined();
    expect(parseSetValue('weightKg', 'abc')).toBeUndefined();
  });

  it('accepts a decimal comma', () => {
    expect(parseSetValue('weightKg', '22,5')).toBe(22.5);
  });

  it('allows negative weight for pulley assist', () => {
    expect(parseSetValue('weightKg', '-10')).toBe(-10);
  });

  it('rejects negative values of other fields', () => {
    expect(parseSetValue('holdS', '-1')).toBeUndefined();
    expect(parseSetValue('durationMin', '-1')).toBeUndefined();
  });

  it('requires whole reps', () => {
    expect(parseSetValue('reps', '8')).toBe(8);
    expect(parseSetValue('reps', '8.5')).toBeUndefined();
  });

  it('requires RPE within 0-10', () => {
    expect(parseSetValue('rpe', '7.5')).toBe(7.5);
    expect(parseSetValue('rpe', '11')).toBeUndefined();
  });
});
