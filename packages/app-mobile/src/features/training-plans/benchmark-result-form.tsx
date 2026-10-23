import { benchmarkResultPutRequest } from '@jrposada/fit-log-shared/common/training-plans/benchmark-logging';
import { addDays } from '@jrposada/fit-log-shared/common/training-plans/dates';
import {
  TrainingPlanBenchmark,
  TrainingPlanBenchmarkUnit,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { useBenchmarkResultsPut } from '@jrposada/fit-log-shared-react/api/benchmark-results/use-benchmark-results-put';
import { FunctionComponent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardTypeOptions } from 'react-native';

import Button from '../../library/button';
import FormTextArea from '../../library/form/form-text-area';
import FormTextInput from '../../library/form/form-text-input';
import IconButton from '../../library/icon-button';
import Stack from '../../library/stack';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import { formatLocalDate, toLocalDateString } from './local-date';

const KEYBOARD_TYPES: Record<TrainingPlanBenchmarkUnit, KeyboardTypeOptions> = {
  // Negative load is an assisted result; the decimal pad has no minus key
  // on iOS.
  kg: 'numbers-and-punctuation',
  rounds: 'number-pad',
  minutes: 'decimal-pad',
  v_grade: 'default',
  text: 'default',
};

type FormData = {
  value: string;
  notes: string;
};

type BenchmarkResultFormProps = {
  enrollment: string;
  benchmark: TrainingPlanBenchmark;
  onDone: () => void;
};

const BenchmarkResultForm: FunctionComponent<BenchmarkResultFormProps> = ({
  enrollment,
  benchmark,
  onDone,
}) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const methods = useForm<FormData>({
    defaultValues: { value: '', notes: '' },
  });
  const today = toLocalDateString();
  const [date, setDate] = useState(today);

  const benchmarkResultsPut = useBenchmarkResultsPut({
    onSuccess: onDone,
    onError: (error) => {
      toast.show(
        t('training_plans.benchmark_log_error', { error }),
        'destructive'
      );
    },
  });

  const handleSubmit = methods.handleSubmit(({ value, notes }) => {
    const request = benchmarkResultPutRequest({
      enrollment,
      benchmark,
      date,
      valueText: value,
      notes,
    });
    if (!request) {
      methods.setError('value', {
        message: t('training_plans.benchmark_value_invalid'),
      });
      return;
    }
    benchmarkResultsPut.mutate(request);
  });

  return (
    <FormProvider {...methods}>
      <Stack gap="sm">
        <FormTextInput
          name="value"
          label={t('training_plans.benchmark_value_label', {
            unit: t(`training_plans.benchmark_unit_${benchmark.unit}`),
          })}
          required
          keyboardType={KEYBOARD_TYPES[benchmark.unit]}
          autoFocus
        />

        <Stack gap="2xs">
          <Typography size="callout" color="secondary">
            {t('training_plans.benchmark_date_label')}
          </Typography>
          <Stack direction="horizontal" align="center" justify="between">
            <IconButton
              icon="chevron-left"
              size="sm"
              onPress={() => setDate(addDays(date, -1))}
            />
            <Typography size="body" weight="semibold">
              {formatLocalDate(date, i18n.language)}
            </Typography>
            <IconButton
              icon="chevron-right"
              size="sm"
              disabled={date >= today}
              onPress={() => setDate(addDays(date, 1))}
            />
          </Stack>
        </Stack>

        <FormTextArea
          name="notes"
          label={t('training_plans.benchmark_notes_label')}
          numberOfLines={2}
        />

        <Stack direction="horizontal" gap="sm">
          <Button
            title={t('actions.cancel')}
            variant="outline"
            size="md"
            style={{ flex: 1 }}
            onPress={onDone}
          />
          <Button
            title={t('actions.save')}
            size="md"
            style={{ flex: 1 }}
            onPress={handleSubmit}
            disabled={benchmarkResultsPut.isPending}
          />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default BenchmarkResultForm;
