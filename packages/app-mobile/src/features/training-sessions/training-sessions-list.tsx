import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { formatRelativeDate } from '@jrposada/fit-log-shared-react/beautifiers/date';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../library/card';
import EmptyState from '../../library/empty-state';
import { Icon } from '../../library/icon';
import LoadingState from '../../library/loading-state';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';
import { RootStackParamList } from '../../types/routes';
import { SPORT_ICONS } from '../feed/sport-icons';

type TrainingSessionsListProps = {
  trainingSessions: TrainingSession[];
  isLoading: boolean;
};

const TrainingSessionsList: FunctionComponent<TrainingSessionsListProps> = ({
  trainingSessions,
  isLoading,
}) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LoadingState isLoading={isLoading}>
      {trainingSessions.length === 0 ? (
        <EmptyState message={t('home.empty_sessions_warning')} />
      ) : (
        <Stack gap="sm">
          {trainingSessions.map((session) => (
            <Card
              key={session.id}
              onPress={() =>
                navigation.navigate('TrainingSessionsDetail', {
                  trainingSessionId: session.id,
                })
              }
            >
              <Stack direction="horizontal" align="center" gap="sm" spacer="xs">
                <Icon icon={SPORT_ICONS[session.sport]} size="md" />
                <Typography size="body" weight="semibold" style={{ flex: 1 }}>
                  {session.title}
                </Typography>
                <Typography size="caption" color="tertiary">
                  {formatRelativeDate(session.startedAt, t)}
                </Typography>
              </Stack>

              <Stack direction="horizontal" align="center" gap="sm">
                <Typography size="callout" color="secondary">
                  {t('climbing.climbs_count', {
                    count: session.climbHistories.length,
                  })}
                </Typography>
                {session.location && (
                  <>
                    <Separator direction="dot" />
                    <Typography size="callout" color="secondary">
                      {session.location.name}
                    </Typography>
                  </>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </LoadingState>
  );
};

export default TrainingSessionsList;
