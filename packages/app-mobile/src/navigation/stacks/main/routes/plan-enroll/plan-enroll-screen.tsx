import {
  addDays,
  startOfIsoWeek,
} from '@jrposada/fit-log-shared/common/training-plans/dates';
import { usePlanEnrollmentsPut } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-put';
import { useTrainingPlans } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  formatLocalDate,
  toLocalDateString,
} from '../../../../../features/training-plans/local-date';
import Button from '../../../../../library/button';
import Card from '../../../../../library/card';
import EmptyState from '../../../../../library/empty-state';
import IconButton from '../../../../../library/icon-button';
import LoadingState from '../../../../../library/loading-state';
import Screen from '../../../../../library/screen';
import Section from '../../../../../library/section';
import Stack from '../../../../../library/stack';
import { useToast } from '../../../../../library/toast';
import { Typography } from '../../../../../library/typography';
import { RootStackParamList } from '../../../../../types/routes';

type PlanEnrollNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlanEnroll'
>;

const PlanEnrollScreen: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const navigation = useNavigation<PlanEnrollNavigationProp>();

  const { data: plans = [], isLoading: isLoadingPlans } = useTrainingPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  const planId = selectedPlanId ?? plans[0]?.id;
  const { data: plan } = useTrainingPlansById({ id: planId });

  const earliestStartDate = startOfIsoWeek(toLocalDateString());
  const [startDate, setStartDate] = useState(() =>
    addDays(earliestStartDate, 7)
  );

  const planEnrollmentsPut = usePlanEnrollmentsPut({
    onSuccess: () => navigation.goBack(),
    onError: (error) => {
      toast.show(t('training_plans.enroll_error', { error }), 'destructive');
    },
  });

  const handleSubmit = () => {
    if (!planId) return;
    planEnrollmentsPut.mutate({ planId, startDate });
  };

  return (
    <Screen
      padding="lg"
      footer={
        <Button
          title={t('training_plans.enroll_submit')}
          onPress={handleSubmit}
          disabled={!planId || planEnrollmentsPut.isPending}
        />
      }
    >
      <Stack gap="lg">
        <Section title={t('training_plans.enroll_plan_label')} gap="sm">
          <LoadingState isLoading={isLoadingPlans}>
            {plans.length === 0 ? (
              <EmptyState message={t('training_plans.enroll_no_plans')} />
            ) : (
              plans.map((summary) => (
                <Card
                  key={summary.id}
                  variant={summary.id === planId ? 'elevatedStrong' : 'flat'}
                  onPress={() => setSelectedPlanId(summary.id)}
                >
                  <Stack gap="2xs">
                    <Typography size="body" weight="semibold">
                      {summary.name}
                    </Typography>
                    <Typography size="callout" color="secondary">
                      {summary.goal}
                    </Typography>
                  </Stack>
                </Card>
              ))
            )}
          </LoadingState>
        </Section>

        <Section title={t('training_plans.enroll_start_date_label')}>
          <Stack direction="horizontal" align="center" justify="between">
            <IconButton
              icon="chevron-left"
              disabled={startDate <= earliestStartDate}
              onPress={() => setStartDate(addDays(startDate, -7))}
            />
            <Typography size="body" weight="semibold">
              {formatLocalDate(startDate, i18n.language)}
            </Typography>
            <IconButton
              icon="chevron-right"
              onPress={() => setStartDate(addDays(startDate, 7))}
            />
          </Stack>
        </Section>

        {plan && (
          <Section title={t('training_plans.enroll_baseline_title')} gap="sm">
            <Typography size="callout" color="secondary">
              {plan.tindeq.baselineTest.when}
            </Typography>
            <Typography size="body">
              {plan.tindeq.baselineTest.protocol}
            </Typography>
            {plan.tindeq.baselineTest.note && (
              <Typography size="callout" color="secondary">
                {plan.tindeq.baselineTest.note}
              </Typography>
            )}
          </Section>
        )}
      </Stack>
    </Screen>
  );
};

export default PlanEnrollScreen;
