import {
  TrainingPlanBlock,
  TrainingPlanItem,
  TrainingPlanPrescription,
} from '../../models/training-plans/training-plan.ts';

/** 1-based position of `week` within `block`. */
export function weekInBlock(block: TrainingPlanBlock, week: number): number {
  const index = block.weeks.indexOf(week);
  if (index === -1) {
    throw new Error(`Week ${week} is not part of block "${block.id}"`);
  }
  return index + 1;
}

/** Effective prescription of `item` in `week`, with `setsByWeek` resolved
 * into `sets`. */
export function resolvePrescription(
  item: TrainingPlanItem,
  block: TrainingPlanBlock,
  week: number
): TrainingPlanPrescription {
  const { setsByWeek, ...prescription } = item.prescription;
  const sets = setsByWeek?.[weekInBlock(block, week)];
  return sets === undefined ? item.prescription : { ...prescription, sets };
}
