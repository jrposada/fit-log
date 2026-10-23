import { plannedSessionStartRequest } from '@jrposada/fit-log-shared/common/training-plans/planned-session-start-request';
import { PlanEnrollment } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollment';
import { TrainingPlanSessionTemplate } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import {
  TrainingSession,
  TrainingSessionPlanned,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { useTrainingSessions } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions';
import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../library/button';
import LoadingState from '../../library/loading-state';
import Stack from '../../library/stack';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import { RootStackParamList } from '../../types/routes';

const SESSIONS_PAGE_LIMIT = 50;

type PlannedSessionStartProps = {
  enrollment: PlanEnrollment;
  template: TrainingPlanSessionTemplate;
  planned: Omit<TrainingSessionPlanned, 'enrollment'>;
};

const PlannedSessionStart: FunctionComponent<PlannedSessionStartProps> = ({
  enrollment,
  template,
  planned,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: activeSession, isLoading: isLoadingActiveSession } =
    useTrainingSessionsActive();
  const {
    items: sessions,
    isLoading: isLoadingSessions,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTrainingSessions({
    enrollment: enrollment.id,
    limit: SESSIONS_PAGE_LIMIT,
  });

  // The entry's session can be on any page.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openActiveSession = () =>
    navigation.navigate('Tabs', { screen: 'Home' });

  const trainingSessionsPut = useTrainingSessionsPut({
    onSuccess: openActiveSession,
    onError: (error) => {
      toast.show(t('training_plans.start_error', { error }), 'destructive');
    },
  });

  const isThisEntry = (session: TrainingSession) =>
    session.planned?.enrollment === enrollment.id &&
    session.planned.week === planned.week &&
    session.planned.day === planned.day &&
    session.planned.slot === planned.slot &&
    session.planned.sessionTemplateId === planned.sessionTemplateId;

  const doneSession = sessions.find(
    (session) => session.endedAt && isThisEntry(session)
  );

  const content = (() => {
    if (doneSession) {
      return (
        <Button
          title={t('training_plans.view_session')}
          variant="outline"
          onPress={() =>
            navigation.navigate('TrainingSessionsDetail', {
              trainingSessionId: doneSession.id,
            })
          }
        />
      );
    }

    if (activeSession && isThisEntry(activeSession)) {
      return (
        <Stack gap="sm">
          <Typography size="callout" color="secondary">
            {t('training_plans.session_in_progress')}
          </Typography>
          <Button
            title={t('training_plans.open_session')}
            onPress={openActiveSession}
          />
        </Stack>
      );
    }

    return (
      <Stack gap="sm">
        {activeSession && (
          <Typography size="callout" color="secondary">
            {t('training_plans.active_session_blocking')}
          </Typography>
        )}
        <Button
          title={t('training_plans.start_session')}
          icon="play-arrow"
          onPress={() =>
            trainingSessionsPut.mutate(
              plannedSessionStartRequest(
                template,
                { ...planned, enrollment: enrollment.id },
                new Date()
              )
            )
          }
          disabled={!!activeSession || trainingSessionsPut.isPending}
        />
      </Stack>
    );
  })();

  return (
    <LoadingState
      isLoading={isLoadingActiveSession || isLoadingSessions || hasNextPage}
      size="small"
    >
      {content}
    </LoadingState>
  );
};

export default PlannedSessionStart;
