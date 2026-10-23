import { planEntryStatus } from '@jrposada/fit-log-shared/common/training-plans/plan-entry-status';
import { planWeekForDate } from '@jrposada/fit-log-shared/common/training-plans/plan-week-for-date';
import { PlanEnrollment } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollment';
import { TrainingPlan } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { useTrainingSessions } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions';
import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../library/badge';
import Card from '../../library/card';
import LoadingState from '../../library/loading-state';
import Section from '../../library/section';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';
import ScheduleEntryRow from './schedule-entry-row';

const SESSIONS_PAGE_LIMIT = 50;

type PlanWeeksProps = {
  plan: TrainingPlan;
  enrollment: PlanEnrollment;
  /** Local calendar date (`YYYY-MM-DD`). */
  today: string;
};

const PlanWeeks: FunctionComponent<PlanWeeksProps> = ({
  plan,
  enrollment,
  today,
}) => {
  const { t } = useTranslation();

  const {
    items: sessions,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTrainingSessions({
    enrollment: enrollment.id,
    limit: SESSIONS_PAGE_LIMIT,
  });

  // Statuses need every session of the enrollment, not just the first page.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const currentWeek = planWeekForDate(enrollment.startDate, today);

  return (
    <LoadingState isLoading={isLoading || hasNextPage}>
      <Stack gap="lg">
        {plan.blocks.map((block) => {
          const entries = plan.schedule.filter(
            ({ blockId }) => blockId === block.id
          );

          return (
            <Section key={block.id} title={block.name} level={2} gap="sm">
              <Typography size="callout" color="secondary">
                {block.focus}
              </Typography>
              {block.weeks.map((week) => (
                <Card
                  key={week}
                  variant={week === currentWeek ? 'elevatedStrong' : 'flat'}
                >
                  <Stack gap="sm">
                    <Stack direction="horizontal" align="center" gap="sm">
                      <Typography
                        size="body"
                        weight="semibold"
                        style={{ flex: 1 }}
                      >
                        {t('training_plans.overview_week', { week })}
                      </Typography>
                      {week === currentWeek && (
                        <Badge
                          label={t('training_plans.overview_current_week')}
                          variant="info"
                        />
                      )}
                    </Stack>
                    <Separator />
                    {entries.map((entry) => {
                      const { sessionTemplateId } = entry;
                      return (
                        <ScheduleEntryRow
                          key={`${entry.day}-${entry.slot}-${sessionTemplateId}`}
                          entry={entry}
                          template={plan.sessionTemplates.find(
                            ({ id }) => id === sessionTemplateId
                          )}
                          status={
                            sessionTemplateId === null
                              ? undefined
                              : planEntryStatus({
                                  entry: { ...entry, sessionTemplateId },
                                  week,
                                  startDate: enrollment.startDate,
                                  today,
                                  sessions,
                                })
                          }
                          showDay
                        />
                      );
                    })}
                  </Stack>
                </Card>
              ))}
            </Section>
          );
        })}
      </Stack>
    </LoadingState>
  );
};

export default PlanWeeks;
