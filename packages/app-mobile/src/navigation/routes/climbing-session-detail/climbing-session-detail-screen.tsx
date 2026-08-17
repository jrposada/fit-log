import { ClimbHistory } from '@jrposada/fit-log-shared/models/climb-histories/climb-history';
import { useClimbHistories } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories';
import { useTrainingSessionsById } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-by-id';
import { formatRelativeDate } from '@jrposada/fit-log-shared-react/beautifiers/date';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ClimbCard from '../../../features/climbing/components/common/climb-card';
import CollapsibleSection from '../../../library/collapsible-section';
import EmptyState from '../../../library/empty-state';
import LoadingState from '../../../library/loading-state';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import Separator from '../../../library/separator';
import Stack from '../../../library/stack';
import { Typography } from '../../../library/typography';
import { RootStackParamList } from '../../../types/routes';
import Header from '../../common/header';

type ClimbingSessionDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ClimbingSessionDetail'
>;

type ClimbingSessionDetailRouteProp = RouteProp<
  RootStackParamList,
  'ClimbingSessionDetail'
>;

const ClimbingSessionDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbingSessionDetailNavigationProp>();
  const route = useRoute<ClimbingSessionDetailRouteProp>();
  const { sessionId } = route.params;

  const { data: session, isLoading: isLoadingSession } =
    useTrainingSessionsById({ id: sessionId });
  const { items: climbHistories, isLoading: isLoadingHistories } =
    useClimbHistories({ trainingSession: sessionId, limit: 50 });

  const climbHistoriesBySector = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; histories: ClimbHistory[] }
    >();

    climbHistories.forEach((history) => {
      const sectorId = history.sector.id;
      if (!grouped.has(sectorId)) {
        grouped.set(sectorId, { name: history.sector.name, histories: [] });
      }
      grouped.get(sectorId)!.histories.push(history);
    });

    return grouped;
  }, [climbHistories]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header title={session?.title} loading={isLoadingSession} back />
      ),
    });
  }, [navigation, session?.title, isLoadingSession]);

  return (
    <Screen>
      <Section gap="md">
        <Stack gap="2xs">
          <Typography size="callout" color="secondary">
            {session ? formatRelativeDate(session.startedAt, t) : ''}
          </Typography>
          {session?.location && (
            <Typography size="callout" color="secondary">
              {session.location.name}
            </Typography>
          )}
        </Stack>

        {session?.notes && (
          <Stack gap="2xs">
            <Typography size="body" weight="semibold">
              {t('climbing.session_notes_title')}
            </Typography>
            <Typography size="callout" color="secondary">
              {session.notes}
            </Typography>
          </Stack>
        )}

        <Separator />

        <Typography size="body" weight="semibold">
          {t('climbing.session_routes_title')}
        </Typography>

        <LoadingState isLoading={isLoadingHistories}>
          {climbHistoriesBySector.size === 0 ? (
            <EmptyState message={t('climbing.session_no_routes')} />
          ) : (
            Array.from(climbHistoriesBySector.entries()).map(
              ([sectorId, { name, histories }]) => (
                <CollapsibleSection
                  key={sectorId}
                  title={name}
                  count={histories.length}
                  icon="location-on"
                  expanded
                >
                  {histories.map((history) => (
                    <ClimbCard
                      key={history.id}
                      climb={history.climb}
                      location={history.location}
                      sector={history.sector}
                      history={history}
                    />
                  ))}
                </CollapsibleSection>
              )
            )
          )}
        </LoadingState>
      </Section>
    </Screen>
  );
};

export default ClimbingSessionDetailScreen;
