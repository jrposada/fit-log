import {
  NumberOrRange,
  TrainingPlanPrescription,
} from '../../models/training-plans/training-plan.ts';
import { HangLoad } from './hang-load.ts';

export type PrescriptionPartKey =
  | 'sets_reps'
  | 'sets_reps_unit'
  | 'sets_max_reps'
  | 'sets_hold'
  | 'sets'
  | 'reps'
  | 'reps_unit'
  | 'max_reps'
  | 'hold'
  | 'on_off'
  | 'rest'
  | 'duration'
  | 'rpe';

/** A translatable piece of a prescription: `key` names the message and
 * `values` are its preformatted interpolations. */
export type PrescriptionPart = {
  key: PrescriptionPartKey;
  values: Record<string, string>;
};

function formatValue(value: NumberOrRange): string {
  if (typeof value === 'number' || value.min === value.max) {
    return `${typeof value === 'number' ? value : value.min}`;
  }
  return `${value.min}–${value.max}`;
}

function volumePart({
  sets,
  reps,
  holdS,
  unit,
}: TrainingPlanPrescription): PrescriptionPart | undefined {
  if (sets !== undefined) {
    const values = { sets: formatValue(sets) };
    if (reps === null) {
      return { key: 'sets_max_reps', values };
    }
    if (reps !== undefined) {
      return unit
        ? {
            key: 'sets_reps_unit',
            values: { ...values, reps: formatValue(reps), unit },
          }
        : { key: 'sets_reps', values: { ...values, reps: formatValue(reps) } };
    }
    if (holdS !== undefined) {
      return {
        key: 'sets_hold',
        values: { ...values, hold: formatValue(holdS) },
      };
    }
    return { key: 'sets', values };
  }

  if (reps === null) {
    return { key: 'max_reps', values: {} };
  }
  if (reps !== undefined) {
    return unit
      ? { key: 'reps_unit', values: { reps: formatValue(reps), unit } }
      : { key: 'reps', values: { reps: formatValue(reps) } };
  }
  return undefined;
}

/**
 * Numeric part of a prescription as translatable parts, in display order.
 * Free-text fields (`intensity`, `loadHint`, `notes`) are plan content and
 * are shown as they are.
 */
export function formatPrescription(
  prescription: TrainingPlanPrescription
): PrescriptionPart[] {
  const { sets, reps, holdS, onS, offS, restS, durationMin, rpe } =
    prescription;
  const parts: PrescriptionPart[] = [];

  const volume = volumePart(prescription);
  if (volume) {
    parts.push(volume);
  }
  const isHoldInVolume = sets !== undefined && reps === undefined;
  if (holdS !== undefined && !isHoldInVolume) {
    parts.push({ key: 'hold', values: { hold: formatValue(holdS) } });
  }
  if (onS !== undefined && offS !== undefined) {
    parts.push({
      key: 'on_off',
      values: { on: formatValue(onS), off: formatValue(offS) },
    });
  }
  if (restS !== undefined) {
    parts.push({ key: 'rest', values: { rest: formatValue(restS) } });
  }
  if (durationMin !== undefined) {
    parts.push({
      key: 'duration',
      values: { duration: formatValue(durationMin) },
    });
  }
  if (rpe !== undefined) {
    parts.push({ key: 'rpe', values: { rpe: formatValue(rpe) } });
  }
  return parts;
}

export type HangLoadPart = {
  key: 'total' | 'added' | 'assist' | 'assist_to_added';
  values: Record<string, string>;
};

/** Hang load as translatable parts: total load, then the added load or
 * pulley assist when bodyweight is known. */
export function formatHangLoad({
  percent,
  totalKg,
  addedKg,
}: HangLoad): HangLoadPart[] {
  const parts: HangLoadPart[] = [
    {
      key: 'total',
      values: { total: formatValue(totalKg), percent: formatValue(percent) },
    },
  ];
  if (!addedKg) {
    return parts;
  }

  if (addedKg.min >= 0) {
    parts.push({ key: 'added', values: { added: formatValue(addedKg) } });
  } else if (addedKg.max <= 0) {
    parts.push({
      key: 'assist',
      values: {
        assist: formatValue({ min: -addedKg.max, max: -addedKg.min }),
      },
    });
  } else {
    parts.push({
      key: 'assist_to_added',
      values: { assist: `${-addedKg.min}`, added: `${addedKg.max}` },
    });
  }
  return parts;
}
