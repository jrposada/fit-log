import { useFeed } from '@jrposada/fit-log-shared-react/api/feed/use-feed';
import { useFeedStats } from '@jrposada/fit-log-shared-react/api/feed/use-feed-stats';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import FeedRow from '../../../../../../../features/feed/components/feed-row';
import { navigateToSessionDetail } from '../../../../../../../features/feed/navigate-to-session-detail';
import Button from '../../../../../../../library/button';
import EmptyState from '../../../../../../../library/empty-state';
import { IconName } from '../../../../../../../library/icon';
import IconCard from '../../../../../../../library/icon-card';
import LoadingState from '../../../../../../../library/loading-state';
import Measure from '../../../../../../../library/measure';
import Screen from '../../../../../../../library/screen';
import Section from '../../../../../../../library/section';
import Stack from '../../../../../../../library/stack';
import { spacing } from '../../../../../../../library/theme';
import { RootStackParamList } from '../../../../../../../types/routes';

const RECENT_ACTIVITY_LIMIT = 5;

type HeroCardData = {
  id: string;
  icon: IconName;
  value: string;
  title: string;
};

const HomeScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: stats, isLoading: isStatsLoading } = useFeedStats();
  const { items: recentSessions, isLoading: isFeedLoading } = useFeed({
    limit: RECENT_ACTIVITY_LIMIT,
  });

  const heroCards = useMemo<HeroCardData[]>(() => {
    if (!stats) {
      return [];
    }
    return [
      {
        id: 'sessions',
        icon: 'event-available',
        value: String(stats.summary.totalSessions),
        title: t('home.total_sessions'),
      },
      {
        id: 'streak',
        icon: 'local-fire-department',
        value: String(stats.summary.currentStreak),
        title: t('home.current_streak'),
      },
      {
        id: 'time',
        icon: 'timer',
        value: t('climbing.stats_duration_minutes', {
          count: Math.round(stats.summary.totalDurationMinutes),
        }),
        title: t('home.total_time'),
      },
    ];
  }, [stats, t]);

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <LoadingState isLoading={isStatsLoading}>
          <Measure>
            {(width) => {
              const gap = spacing.md;
              const cardWidth =
                heroCards.length > 0
                  ? (width - gap * (heroCards.length - 1)) / heroCards.length
                  : width;
              return (
                <Stack direction="horizontal" gap="md">
                  {heroCards.map((card) => (
                    <IconCard
                      key={card.id}
                      icon={card.icon}
                      title={card.title}
                      subtitle={card.value}
                      variant="stat"
                      style={{ width: cardWidth }}
                    />
                  ))}
                </Stack>
              );
            }}
          </Measure>
        </LoadingState>

        <Section
          title={t('home.recent_sessions')}
          action={
            <Button
              title={t('home.view_all')}
              variant="ghost"
              size="sm"
              onPress={() =>
                navigation.navigate('Tabs', { screen: 'Activity' })
              }
            />
          }
          noPadding
        >
          <LoadingState isLoading={isFeedLoading}>
            {recentSessions.length === 0 ? (
              <EmptyState message={t('home.empty_sessions_warning')} />
            ) : (
              <Stack gap="sm">
                {recentSessions.map((session) => (
                  <FeedRow
                    key={session.id}
                    session={session}
                    onPress={(s) => navigateToSessionDetail(navigation, s)}
                  />
                ))}
              </Stack>
            )}
          </LoadingState>
        </Section>
      </Stack>

      {/* Spacer so the last card isn't hidden behind the session flyover. */}
      <View style={{ height: spacing['4xl'] }} />
    </Screen>
  );
};

export default HomeScreen;
