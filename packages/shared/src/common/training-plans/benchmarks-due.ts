import {
  TrainingPlan,
  TrainingPlanBenchmark,
} from '../../models/training-plans/training-plan.ts';

/** Benchmarks to retest in `week`; week 0 is before the plan starts. */
export function benchmarksDue(
  plan: TrainingPlan,
  week: number
): TrainingPlanBenchmark[] {
  return plan.benchmarks.filter(({ retestWeeks }) =>
    retestWeeks.includes(week)
  );
}
