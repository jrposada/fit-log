import { benchmarkResultsByBenchmark } from '@jrposada/fit-log-shared/common/training-plans/benchmark-logging';
import { benchmarksDue } from '@jrposada/fit-log-shared/common/training-plans/benchmarks-due';
import { planWeekForDate } from '@jrposada/fit-log-shared/common/training-plans/plan-week-for-date';
import { useBenchmarkResults } from '@jrposada/fit-log-shared-react/api/benchmark-results/use-benchmark-results';
import { usePlanEnrollmentsActive } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-active';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import BenchmarkCard from '../../../../../features/training-plans/benchmark-card';
import { toLocalDateString } from '../../../../../features/training-plans/local-date';
import EmptyState from '../../../../../library/empty-state';
import LoadingState from '../../../../../library/loading-state';
import Screen from '../../../../../library/screen';
import Stack from '../../../../../library/stack';

const BenchmarksScreen: FunctionComponent = () => {
  const { t } = useTranslation();

  const { data: enrollment, isLoading: isLoadingEnrollment } =
    usePlanEnrollmentsActive();
  const { data: plan, isLoading: isLoadingPlan } = useTrainingPlansById({
    id: enrollment?.planId,
  });
  const { data: benchmarkResults = [], isLoading: isLoadingResults } =
    useBenchmarkResults({ enrollment: enrollment?.id });

  const isLoading = isLoadingEnrollment || isLoadingPlan || isLoadingResults;

  const content = (() => {
    if (!enrollment) {
      return <EmptyState message={t('training_plans.benchmarks_no_plan')} />;
    }
    if (!plan) {
      return null;
    }

    const currentWeek = planWeekForDate(
      enrollment.startDate,
      toLocalDateString()
    );
    const dueIds = new Set(
      benchmarksDue(plan, currentWeek).map(({ id }) => id)
    );
    const resultsByBenchmark = benchmarkResultsByBenchmark(benchmarkResults);

    return (
      <Stack gap="sm">
        {plan.benchmarks.map((benchmark) => (
          <BenchmarkCard
            key={benchmark.id}
            enrollment={enrollment.id}
            benchmark={benchmark}
            results={resultsByBenchmark.get(benchmark.id) ?? []}
            currentWeek={currentWeek}
            isDue={dueIds.has(benchmark.id)}
          />
        ))}
      </Stack>
    );
  })();

  return (
    <Screen padding="lg">
      <LoadingState isLoading={isLoading}>{content}</LoadingState>
    </Screen>
  );
};

export default BenchmarksScreen;
