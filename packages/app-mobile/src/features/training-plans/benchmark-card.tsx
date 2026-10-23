import { BenchmarkResult } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-result';
import { TrainingPlanBenchmark } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { useBenchmarkResultsDelete } from '@jrposada/fit-log-shared-react/api/benchmark-results/use-benchmark-results-delete';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { Badge } from '../../library/badge';
import Button from '../../library/button';
import Card from '../../library/card';
import CollapsibleSection from '../../library/collapsible-section';
import IconButton from '../../library/icon-button';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import BenchmarkResultForm from './benchmark-result-form';
import { benchmarkValueText, benchmarkWeekText } from './benchmark-text';
import { formatLocalDate } from './local-date';

type BenchmarkCardProps = {
  enrollment: string;
  benchmark: TrainingPlanBenchmark;
  /** Results of `benchmark`, newest first. */
  results: BenchmarkResult[];
  /** Plan week of today; week 0 is before the plan starts. */
  currentWeek: number;
  isDue: boolean;
};

const BenchmarkCard: FunctionComponent<BenchmarkCardProps> = ({
  enrollment,
  benchmark,
  results,
  currentWeek,
  isDue,
}) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [isLogging, setIsLogging] = useState(false);

  const benchmarkResultsDelete = useBenchmarkResultsDelete({
    onError: (error) => {
      toast.show(
        t('training_plans.benchmark_delete_error', { error }),
        'destructive'
      );
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      t('training_plans.benchmark_delete_confirm_title'),
      t('training_plans.benchmark_delete_confirm_message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.delete'),
          style: 'destructive',
          onPress: () => benchmarkResultsDelete.mutate({ id }),
        },
      ]
    );
  };

  const latest = results[0];

  return (
    <Card variant="flat">
      <Stack gap="xs">
        <Stack direction="horizontal" align="center" gap="sm">
          <Typography size="body" weight="semibold" style={{ flex: 1 }}>
            {benchmark.name}
          </Typography>
          {isDue && (
            <Badge
              label={t('training_plans.benchmark_due')}
              variant="warning"
            />
          )}
        </Stack>

        <Typography size="callout" color="secondary">
          {t('training_plans.benchmark_retest_weeks')}
          {benchmark.retestWeeks.map((week, index) => (
            <Typography
              key={week}
              size="callout"
              color={week === currentWeek ? 'warning' : 'secondary'}
              weight={week === currentWeek ? 'semibold' : undefined}
            >
              {`${index > 0 ? ', ' : ''}${
                week === 0 ? t('training_plans.benchmark_baseline') : week
              }`}
            </Typography>
          ))}
        </Typography>

        <Typography size="callout" weight={latest ? 'semibold' : undefined}>
          {latest
            ? t('training_plans.benchmark_latest', {
                value: benchmarkValueText(t, benchmark.unit, latest.value),
              })
            : t('training_plans.benchmark_no_results')}
        </Typography>

        {isLogging ? (
          <>
            <Separator />
            <BenchmarkResultForm
              enrollment={enrollment}
              benchmark={benchmark}
              onDone={() => setIsLogging(false)}
            />
          </>
        ) : (
          <Button
            title={t('training_plans.benchmark_log')}
            icon="add"
            size="sm"
            variant={isDue ? 'primary' : 'outline'}
            onPress={() => setIsLogging(true)}
          />
        )}

        {results.length > 0 && (
          <CollapsibleSection
            title={t('training_plans.benchmark_history')}
            count={results.length}
          >
            <Stack gap="sm">
              {results.map((result) => (
                <Stack
                  key={result.id}
                  direction="horizontal"
                  align="center"
                  gap="sm"
                >
                  <Stack gap="0" flex>
                    <Typography size="callout" weight="semibold">
                      {benchmarkValueText(t, benchmark.unit, result.value)}
                    </Typography>
                    <Typography size="caption" color="secondary">
                      {`${formatLocalDate(result.date, i18n.language)} · ${benchmarkWeekText(t, result.week)}`}
                    </Typography>
                    {result.notes && (
                      <Typography size="caption" color="tertiary">
                        {result.notes}
                      </Typography>
                    )}
                  </Stack>
                  <IconButton
                    icon="delete-outline"
                    size="sm"
                    variant="ghost"
                    disabled={benchmarkResultsDelete.isPending}
                    onPress={() => handleDelete(result.id)}
                  />
                </Stack>
              ))}
            </Stack>
          </CollapsibleSection>
        )}
      </Stack>
    </Card>
  );
};

export default BenchmarkCard;
