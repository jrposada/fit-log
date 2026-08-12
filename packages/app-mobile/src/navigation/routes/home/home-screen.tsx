import { useFeed } from '@jrposada/fit-log-shared-react/api/feed/use-feed';
import { useFeedStats } from '@jrposada/fit-log-shared-react/api/feed/use-feed-stats';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ActiveSessionCard from '../../../features/climbing/components/common/active-session-card';
import { useActiveClimbingSession } from '../../../features/climbing/hooks/use-active-climbing-session';
import FeedRow from '../../../features/feed/components/feed-row';
import { navigateToSessionDetail } from '../../../features/feed/navigate-to-session-detail';
import { SPORT_ICONS } from '../../../features/feed/sport-icons';
import EmptyState from '../../../library/empty-state';
import IconCard from '../../../library/icon-card';
import LoadingState from '../../../library/loading-state';
import Measure from '../../../library/measure';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import Stack from '../../../library/stack';
import { palette, spacing } from '../../../library/theme';
import { RootStackParamList } from '../../../types/routes';
import { styles } from './home.styles';

const RECENT_ACTIVITY_LIMIT = 5;

type HeroCardData = {
  id: string;
  icon: string;
  color: string;
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
  const { activeSession } = useActiveClimbingSession();

  const heroCards = useMemo<HeroCardData[]>(() => {
    if (!stats) {
      return [];
    }
    return [
      {
        id: 'sessions',
        icon: '🗓️',
        color: palette.blue,
        value: String(stats.summary.totalSessions),
        title: t('home.total_sessions'),
      },
      {
        id: 'streak',
        icon: '🔥',
        color: palette.amber,
        value: String(stats.summary.currentStreak),
        title: t('home.current_streak'),
      },
      {
        id: 'time',
        icon: '⏱️',
        color: palette.plum,
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
        {activeSession && (
          <ActiveSessionCard
            session={activeSession}
            onPress={() =>
              navigation.navigate('ClimbingSessionDetail', {
                sessionId: activeSession.id,
              })
            }
          />
        )}

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
                      color={card.color}
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

        {stats && stats.bySport.length > 0 && (
          <Section title={t('home.per_sport_title')} noPadding>
            <View style={styles.cardsContainer}>
              {stats.bySport.map((entry) => (
                <IconCard
                  key={entry.sport}
                  icon={SPORT_ICONS[entry.sport]}
                  color={palette.green}
                  title={t(`${entry.sport}.title`)}
                  subtitle={String(entry.count)}
                  variant="stat"
                />
              ))}
            </View>
          </Section>
        )}

        <Section title={t('home.recent_activity')} noPadding>
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

      {/* Spacer so the last card isn't hidden behind the central FAB. */}
      <View style={{ height: spacing['4xl'] }} />
    </Screen>
  );
};

export default HomeScreen;
