import { benchmarksDue } from '@jrposada/fit-log-shared/common/training-plans/benchmarks-due';
import { daysBetween } from '@jrposada/fit-log-shared/common/training-plans/dates';
import { resolvePlanDay } from '@jrposada/fit-log-shared/common/training-plans/resolve-plan-day';
import { usePlanEnrollmentsActive } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-active';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../library/badge';
import Card from '../../library/card';
import { Icon } from '../../library/icon';
import LoadingState from '../../library/loading-state';
import Section from '../../library/section';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { ink } from '../../library/theme';
import { Typography } from '../../library/typography';
import { RootStackParamList } from '../../types/routes';
import { toLocalDateString } from './local-date';
import ScheduleEntryRow from './schedule-entry-row';

const TodayCard: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: enrollment, isLoading: isLoadingEnrollment } =
    usePlanEnrollmentsActive();
  const { data: plan, isLoading: isLoadingPlan } = useTrainingPlansById({
    id: enrollment?.planId,
  });

  const content = (() => {
    if (!enrollment) {
      return (
        <Card onPress={() => navigation.navigate('PlanEnroll')}>
          <Stack direction="horizontal" align="center" gap="md">
            <Icon icon="fitness-center" size="md" color={ink.secondary} />
            <Stack gap="2xs" flex>
              <Typography size="body" weight="semibold">
                {t('training_plans.start_plan')}
              </Typography>
              <Typography size="callout" color="secondary">
                {t('training_plans.start_plan_description')}
              </Typography>
            </Stack>
            <Icon icon="chevron-right" size="md" color={ink.secondary} />
          </Stack>
        </Card>
      );
    }

    if (!plan) {
      return null;
    }

    const today = toLocalDateString();
    const planDay = resolvePlanDay(plan, enrollment.startDate, today);
    const openOverview = () => navigation.navigate('PlanOverview');

    if (planDay.status === 'before') {
      return (
        <Card onPress={openOverview}>
          <Stack gap="2xs">
            <Typography size="body" weight="semibold">
              {plan.name}
            </Typography>
            <Typography size="callout" color="accent">
              {t('training_plans.starts_in', {
                count: daysBetween(today, enrollment.startDate),
              })}
            </Typography>
            <Typography size="callout" color="secondary">
              {t('training_plans.baseline_reminder')}
            </Typography>
          </Stack>
        </Card>
      );
    }

    if (planDay.status === 'after') {
      return (
        <Card onPress={openOverview}>
          <Stack direction="horizontal" align="center" gap="md">
            <Icon icon="emoji-events" size="md" color={ink.secondary} />
            <Stack gap="2xs" flex>
              <Typography size="body" weight="semibold">
                {t('training_plans.plan_complete')}
              </Typography>
              <Typography size="callout" color="secondary">
                {plan.name}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      );
    }

    const hasBenchmarksDue = benchmarksDue(plan, planDay.week).length > 0;

    return (
      <Card onPress={openOverview}>
        <Stack gap="sm">
          <Stack direction="horizontal" align="center" gap="sm">
            <Typography size="body" weight="semibold" style={{ flex: 1 }}>
              {t('training_plans.week_block', {
                week: planDay.week,
                block: planDay.block.name,
              })}
            </Typography>
            {hasBenchmarksDue && (
              <Badge
                label={t('training_plans.benchmarks_due')}
                variant="warning"
              />
            )}
          </Stack>
          <Separator />
          {planDay.entries.length === 0 ? (
            <Typography size="callout" color="secondary">
              {t('training_plans.rest_day')}
            </Typography>
          ) : (
            planDay.entries.map((entry) => {
              const { sessionTemplateId } = entry;
              return (
                <ScheduleEntryRow
                  key={`${entry.slot}-${sessionTemplateId}`}
                  entry={entry}
                  template={plan.sessionTemplates.find(
                    ({ id }) => id === sessionTemplateId
                  )}
                  onPress={
                    sessionTemplateId === null
                      ? undefined
                      : () =>
                          navigation.navigate('PlannedSessionDetail', {
                            week: planDay.week,
                            day: entry.day,
                            slot: entry.slot,
                            sessionTemplateId,
                          })
                  }
                />
              );
            })
          )}
        </Stack>
      </Card>
    );
  })();

  const isLoading = isLoadingEnrollment || isLoadingPlan;
  if (!isLoading && !content) {
    return null;
  }

  return (
    <Section title={t('training_plans.today_title')} noPadding>
      <LoadingState isLoading={isLoading} size="small">
        {content}
      </LoadingState>
    </Section>
  );
};

export default TodayCard;
