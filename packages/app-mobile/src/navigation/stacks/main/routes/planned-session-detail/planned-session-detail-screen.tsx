import { latestBenchmarkValue } from '@jrposada/fit-log-shared/common/training-plans/latest-benchmark-value';
import { resolvePrescription } from '@jrposada/fit-log-shared/common/training-plans/resolve-prescription';
import { TRAINING_PLAN_ITEM_SECTIONS } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { useBenchmarkResults } from '@jrposada/fit-log-shared-react/api/benchmark-results/use-benchmark-results';
import { usePlanEnrollmentsActive } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-active';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import PlannedItemCard from '../../../../../features/training-plans/planned-item-card';
import PlannedSessionStart from '../../../../../features/training-plans/planned-session-start';
import LoadingState from '../../../../../library/loading-state';
import Screen from '../../../../../library/screen';
import Section from '../../../../../library/section';
import Stack from '../../../../../library/stack';
import { Typography } from '../../../../../library/typography';
import { RootStackParamList } from '../../../../../types/routes';

type PlannedSessionDetailRouteProp = RouteProp<
  RootStackParamList,
  'PlannedSessionDetail'
>;

const PlannedSessionDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const route = useRoute<PlannedSessionDetailRouteProp>();
  const { week, day, slot, sessionTemplateId } = route.params;

  const { data: enrollment, isLoading: isLoadingEnrollment } =
    usePlanEnrollmentsActive();
  const { data: plan, isLoading: isLoadingPlan } = useTrainingPlansById({
    id: enrollment?.planId,
  });
  const { data: benchmarkResults = [] } = useBenchmarkResults({
    enrollment: enrollment?.id,
  });

  const block = plan?.blocks.find(({ weeks }) => weeks.includes(week));
  const template = plan?.sessionTemplates.find(
    ({ id }) => id === sessionTemplateId
  );
  const entry = plan?.schedule.find(
    (candidate) =>
      candidate.blockId === block?.id &&
      candidate.day === day &&
      candidate.slot === slot &&
      candidate.sessionTemplateId === sessionTemplateId
  );

  const mvcKg = latestBenchmarkValue(benchmarkResults, 'open_hand_mvc');
  const bodyweightKg = latestBenchmarkValue(benchmarkResults, 'bodyweight');

  return (
    <Screen
      padding="lg"
      footer={
        enrollment &&
        template && (
          <PlannedSessionStart
            enrollment={enrollment}
            template={template}
            planned={{ week, day, slot, sessionTemplateId }}
          />
        )
      }
    >
      <LoadingState isLoading={isLoadingEnrollment || isLoadingPlan}>
        {plan && block && template && (
          <Stack gap="lg">
            <Stack gap="2xs">
              <Typography size="title">{template.name}</Typography>
              <Typography size="callout" color="secondary">
                {[
                  t('training_plans.planned_session_when', {
                    week,
                    day: t(`training_plans.day_${day}`),
                    slot: t(`training_plans.slot_${slot}`),
                  }),
                  template.durationMin !== undefined &&
                    t('training_plans.duration_min', {
                      count: template.durationMin,
                    }),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Typography>
              <Typography size="callout" color="secondary">
                {template.focus}
              </Typography>
              {entry?.notes && (
                <Typography size="callout" color="accent">
                  {entry.notes}
                </Typography>
              )}
            </Stack>

            {TRAINING_PLAN_ITEM_SECTIONS.map((section) => {
              const items = template.items.filter(
                (item) => item.section === section
              );
              if (items.length === 0) {
                return null;
              }

              return (
                <Section
                  key={section}
                  title={t(`training_plans.section_${section}`)}
                  level={2}
                  gap="sm"
                >
                  {items.map((item) => (
                    <PlannedItemCard
                      key={item.order}
                      plan={plan}
                      blockId={block.id}
                      item={item}
                      prescription={resolvePrescription(item, block, week)}
                      mvcKg={mvcKg}
                      bodyweightKg={bodyweightKg}
                    />
                  ))}
                </Section>
              );
            })}
          </Stack>
        )}
      </LoadingState>
    </Screen>
  );
};

export default PlannedSessionDetailScreen;
