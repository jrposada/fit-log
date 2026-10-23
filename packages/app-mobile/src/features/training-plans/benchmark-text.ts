import { TrainingPlanBenchmarkUnit } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { TFunction } from 'i18next';

export function benchmarkValueText(
  t: TFunction,
  unit: TrainingPlanBenchmarkUnit,
  value: number | string
): string {
  return unit === 'v_grade' || unit === 'text'
    ? String(value)
    : `${value} ${t(`training_plans.benchmark_unit_${unit}`)}`;
}

/** Week 0 is the baseline test before the plan starts. */
export function benchmarkWeekText(t: TFunction, week: number): string {
  return week === 0
    ? t('training_plans.benchmark_baseline')
    : t('training_plans.overview_week', { week });
}
