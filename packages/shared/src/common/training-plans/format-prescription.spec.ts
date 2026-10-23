import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { formatHangLoad, formatPrescription } from './format-prescription.ts';
import { hangLoad } from './hang-load.ts';
import { resolvePrescription } from './resolve-prescription.ts';

const plan = loadSeedTrainingPlan();

function prescriptionOf(templateId: string, exerciseId: string, week = 1) {
  const item = plan.sessionTemplates
    .find((template) => template.id === templateId)!
    .items.find((candidate) => candidate.exerciseId === exerciseId)!;
  const block = plan.blocks.find(({ weeks }) => weeks.includes(week))!;
  return resolvePrescription(item, block, week);
}

describe('formatPrescription', () => {
  it('formats sets × reps, on/off and rest', () => {
    expect(
      formatPrescription(
        prescriptionOf('b1_tue_hangboard_pull', 'open_hand_repeaters')
      )
    ).toEqual([
      { key: 'sets_reps', values: { sets: '3', reps: '6' } },
      { key: 'on_off', values: { on: '7', off: '3' } },
      { key: 'rest', values: { rest: '180' } },
    ]);
  });

  it('uses the effective sets of the week', () => {
    expect(
      formatPrescription(
        prescriptionOf('b1_tue_hangboard_pull', 'open_hand_repeaters', 3)
      )[0]
    ).toEqual({ key: 'sets_reps', values: { sets: '5', reps: '6' } });
  });

  it('formats ranges with an en dash and a reps unit', () => {
    expect(
      formatPrescription(
        prescriptionOf('b1_thu_limit_boulder', 'limit_bouldering')
      )
    ).toEqual([
      { key: 'reps_unit', values: { reps: '6–8', unit: 'problems' } },
      { key: 'rest', values: { rest: '180–300' } },
      { key: 'duration', values: { duration: '45' } },
    ]);
  });

  it('formats null reps as max reps', () => {
    expect(formatPrescription(prescriptionOf('gym_a_b1', 'pushup'))).toEqual([
      { key: 'sets_max_reps', values: { sets: '2' } },
    ]);
  });

  it('formats sets × hold', () => {
    expect(formatPrescription(prescriptionOf('gym_b', 'plank', 5))).toEqual([
      { key: 'sets_hold', values: { sets: '3', hold: '40' } },
    ]);
  });

  it('formats a sets range with hold, rest and RPE', () => {
    expect(
      formatPrescription(
        prescriptionOf('b2_mon_heavy_hang_pull', 'max_hangs_open_hand', 5)
      )
    ).toEqual([
      { key: 'sets_hold', values: { sets: '5–6', hold: '10' } },
      { key: 'rest', values: { rest: '180' } },
      { key: 'rpe', values: { rpe: '8' } },
    ]);
  });

  it('formats an RPE range', () => {
    expect(
      formatPrescription(prescriptionOf('gym_a_b2', 'bench_press', 5))
    ).toEqual([
      { key: 'sets_reps', values: { sets: '3', reps: '8' } },
      { key: 'rpe', values: { rpe: '7–8' } },
    ]);
  });

  it('formats sets alone', () => {
    expect(
      formatPrescription(prescriptionOf('b2_fri_4x4', 'four_by_four', 5))
    ).toEqual([
      { key: 'sets', values: { sets: '4' } },
      { key: 'rest', values: { rest: '240' } },
    ]);
  });

  it('formats reps without sets', () => {
    expect(
      formatPrescription(prescriptionOf('b1_mon_technique_arc', 'silent_feet'))
    ).toEqual([{ key: 'reps_unit', values: { reps: '10', unit: 'problems' } }]);
    expect(formatPrescription({ reps: 5 })).toEqual([
      { key: 'reps', values: { reps: '5' } },
    ]);
    expect(formatPrescription({ reps: null })).toEqual([
      { key: 'max_reps', values: {} },
    ]);
  });

  it('formats sets × reps with a unit', () => {
    expect(formatPrescription({ sets: 2, reps: 4, unit: 'problems' })).toEqual([
      {
        key: 'sets_reps_unit',
        values: { sets: '2', reps: '4', unit: 'problems' },
      },
    ]);
  });

  it('formats a hold without sets', () => {
    expect(formatPrescription({ holdS: 30 })).toEqual([
      { key: 'hold', values: { hold: '30' } },
    ]);
  });

  it('formats duration only', () => {
    expect(
      formatPrescription(prescriptionOf('b1_mon_technique_arc', 'arc'))
    ).toEqual([{ key: 'duration', values: { duration: '20' } }]);
  });

  it('is empty for a text-only prescription', () => {
    expect(
      formatPrescription(prescriptionOf('optional_easy_climb', 'easy_climbing'))
    ).toEqual([]);
  });
});

describe('formatHangLoad', () => {
  it('formats total load with the MVC percentage', () => {
    expect(
      formatHangLoad(hangLoad(plan, 'open_hand_repeaters', 'block1', 100)!)
    ).toEqual([{ key: 'total', values: { total: '60–70', percent: '60–70' } }]);
  });

  it('collapses an equal range to one value', () => {
    expect(
      formatHangLoad(hangLoad(plan, 'max_hangs_open_hand', 'block3', 100)!)
    ).toEqual([{ key: 'total', values: { total: '85', percent: '85' } }]);
  });

  it('formats added load', () => {
    expect(
      formatHangLoad(
        hangLoad(plan, 'max_hangs_open_hand', 'block2', 100, 70)!
      )[1]
    ).toEqual({ key: 'added', values: { added: '15–20' } });
  });

  it('formats pulley assist', () => {
    expect(
      formatHangLoad(
        hangLoad(plan, 'open_hand_repeaters', 'block1', 100, 75)!
      )[1]
    ).toEqual({ key: 'assist', values: { assist: '5–15' } });
    expect(
      formatHangLoad(
        hangLoad(plan, 'open_hand_repeaters', 'block1', 100, 70)!
      )[1]
    ).toEqual({ key: 'assist', values: { assist: '0–10' } });
  });

  it('formats a range from assist to added load', () => {
    expect(
      formatHangLoad(
        hangLoad(plan, 'open_hand_repeaters', 'block1', 100, 65)!
      )[1]
    ).toEqual({ key: 'assist_to_added', values: { assist: '5', added: '5' } });
  });
});
