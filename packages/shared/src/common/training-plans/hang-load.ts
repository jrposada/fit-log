import {
  Range,
  TrainingPlan,
} from '../../models/training-plans/training-plan.ts';

export type HangLoad = {
  percent: Range;

  /** Bodyweight plus added load, in kg. */
  totalKg: Range;

  /** Load to add on top of bodyweight, in kg. Negative means pulley assist. */
  addedKg?: Range;
};

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/** Whether `exerciseId` is loaded from the open-hand MVC. */
export function hasHangLoad(plan: TrainingPlan, exerciseId: string): boolean {
  return plan.tindeq.loadPrescription.some(
    (prescription) => prescription.exerciseId === exerciseId
  );
}

/**
 * Hang load for `exerciseId` in `blockId`, derived from the open-hand MVC,
 * which is a total load (bodyweight + added). `null` when the exercise has no
 * load prescription.
 */
export function hangLoad(
  plan: TrainingPlan,
  exerciseId: string,
  blockId: string,
  mvcKg: number,
  bodyweightKg?: number
): HangLoad | null {
  const prescriptions = plan.tindeq.loadPrescription.filter(
    (prescription) => prescription.exerciseId === exerciseId
  );
  const prescription =
    prescriptions.find((candidate) => candidate.blockId === blockId) ??
    prescriptions.find((candidate) => candidate.blockId === undefined);
  if (!prescription) {
    return null;
  }

  const [minPercent, maxPercent] = prescription.percentOfMvc;
  const totalKg = {
    min: roundToHalf((mvcKg * minPercent) / 100),
    max: roundToHalf((mvcKg * maxPercent) / 100),
  };
  const load: HangLoad = {
    percent: { min: minPercent, max: maxPercent },
    totalKg,
  };
  if (bodyweightKg !== undefined) {
    load.addedKg = {
      min: roundToHalf(totalKg.min - bodyweightKg),
      max: roundToHalf(totalKg.max - bodyweightKg),
    };
  }
  return load;
}
