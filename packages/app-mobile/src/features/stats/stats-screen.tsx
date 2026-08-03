import { Sport, SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import { useFeedStats } from '@jrposada/fit-log-shared-react/api/feed/use-feed-stats';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import Card from '../../library/card';
import EmptyState from '../../library/empty-state';
import LoadingState from '../../library/loading-state';
import Measure from '../../library/measure';
import Screen from '../../library/screen';
import Section from '../../library/section';
import Stack from '../../library/stack';
import Tabs, { TabBarItem } from '../../library/tabs';
import { accent, ink, palette, spacing, typography } from '../../library/theme';
import { Typography } from '../../library/typography';
import ClimbingStatsPanel from '../climbing/components/climbing-stats-panel/climbing-stats-panel';
import { SportFilter } from '../feed/sport-filter-context';
import { SPORT_ICONS } from '../feed/sport-icons';
import { useSportFilter } from '../feed/use-sport-filter';

/** Period keys arrive as "2026-06" (month) or "2026-W23" (ISO week). */
const formatPeriodLabel = (period: string): string => {
  const month = /^(\d{4})-(\d{2})$/.exec(period);
  if (month) {
    const date = new Date(Number(month[1]), Number(month[2]) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'short' });
  }
  const week = /^\d{4}-W(\d{2})$/.exec(period);
  if (week) {
    return `W${week[1]}`;
  }
  return period;
};

const Y_AXIS_GUTTER = spacing['3xl'];

type SummaryCardData = {
  id: string;
  icon: string;
  color: string;
  value: string;
  label: string;
};

const SummaryCard: FunctionComponent<{
  card: SummaryCardData;
  width: number;
}> = ({ card, width }) => (
  <Card variant="elevated" size="md" highlight={card.color} style={{ width }}>
    <Stack flex align="center" justify="center" gap="2xs">
      <Typography size="title">{card.icon}</Typography>
      <Typography size="heading" weight="bold" style={{ color: card.color }}>
        {card.value}
      </Typography>
      <Typography size="caption" color="secondary" align="center">
        {card.label}
      </Typography>
    </Stack>
  </Card>
);

const StatsScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const { sportFilter, setSportFilter } = useSportFilter();

  const { data, isLoading } = useFeedStats(
    sportFilter === 'all' ? undefined : { sport: sportFilter }
  );

  const filterItems: TabBarItem<SportFilter>[] = [
    { id: 'all', label: t('common.filter_all') },
    ...SPORTS.map((sport) => ({ id: sport, label: t(`${sport}.title`) })),
  ];

  const cards = useMemo<SummaryCardData[]>(() => {
    if (!data) {
      return [];
    }
    const { summary } = data;
    return [
      {
        id: 'sessions',
        icon: '🗓️',
        color: palette.blue,
        value: String(summary.totalSessions),
        label: t('stats.summary_sessions'),
      },
      {
        id: 'active-days',
        icon: '📅',
        color: palette.green,
        value: String(summary.totalActiveDays),
        label: t('stats.summary_active_days'),
      },
      {
        id: 'streak',
        icon: '🔥',
        color: palette.amber,
        value: String(summary.currentStreak),
        label: t('stats.summary_current_streak'),
      },
      {
        id: 'longest-streak',
        icon: '🏆',
        color: palette.gold,
        value: String(summary.longestStreak),
        label: t('stats.summary_longest_streak'),
      },
    ];
  }, [data, t]);

  const activityData = useMemo(
    () =>
      (data?.activity ?? []).map((entry) => ({
        value: entry.count,
        label: formatPeriodLabel(entry.period),
        frontColor: accent.primary,
      })),
    [data?.activity]
  );

  const showEmpty = !data || data.summary.totalSessions === 0;

  return (
    <Screen stickyHeaderIndices={[0]}>
      <Tabs.Bar<SportFilter>
        items={filterItems}
        activeId={sportFilter}
        onChange={setSportFilter}
      />

      {sportFilter === 'climbing' ? (
        <ClimbingStatsPanel />
      ) : sportFilter !== 'all' ? (
        <Section gap="md">
          {/* `sportFilter` narrows to `never` here today (only 'climbing'
              exists), which breaks the i18next key check below — cast back
              to keep this branch typechecking as new sports are added. */}
          <EmptyState
            message={t('stats.sport_placeholder', {
              sport: t(`${sportFilter as Sport}.title`),
            })}
          />
        </Section>
      ) : (
        <Section gap="md">
          <LoadingState isLoading={isLoading}>
            {showEmpty ? (
              <EmptyState message={t('stats.empty')} />
            ) : (
              <>
                <Measure>
                  {(width) => {
                    const gap = spacing.sm;
                    const cardWidth =
                      (width - gap * (cards.length - 1)) / cards.length;
                    return (
                      <Stack direction="horizontal" gap="sm">
                        {cards.map((card) => (
                          <SummaryCard
                            key={card.id}
                            card={card}
                            width={cardWidth}
                          />
                        ))}
                      </Stack>
                    );
                  }}
                </Measure>

                {activityData.length > 0 && (
                  <Card variant="elevated" size="lg">
                    <Stack gap="sm">
                      <Typography size="body" weight="semibold">
                        {t('stats.activity_title')}
                      </Typography>
                      <Measure>
                        {(width) => (
                          <BarChart
                            data={activityData}
                            width={width - Y_AXIS_GUTTER}
                            yAxisLabelWidth={Y_AXIS_GUTTER}
                            barWidth={spacing.xl}
                            spacing={spacing.md}
                            initialSpacing={spacing.md}
                            yAxisColor={ink.tertiary}
                            xAxisColor={ink.tertiary}
                            rulesColor={ink.disabled}
                            yAxisTextStyle={{
                              color: ink.tertiary,
                              fontSize: typography.caption.fontSize,
                            }}
                            xAxisLabelTextStyle={{
                              color: ink.tertiary,
                              fontSize: typography.caption.fontSize,
                            }}
                          />
                        )}
                      </Measure>
                    </Stack>
                  </Card>
                )}

                {data.bySport.length > 0 && (
                  <Card variant="elevated" size="lg">
                    <Stack gap="sm">
                      <Typography size="body" weight="semibold">
                        {t('stats.by_sport_title')}
                      </Typography>
                      {data.bySport.map((entry) => (
                        <Stack
                          key={entry.sport}
                          direction="horizontal"
                          align="center"
                          gap="sm"
                        >
                          <Typography size="title">
                            {SPORT_ICONS[entry.sport]}
                          </Typography>
                          <Typography size="body" style={{ flex: 1 }}>
                            {t(`${entry.sport}.title`)}
                          </Typography>
                          <Typography size="callout" color="secondary">
                            {entry.count}
                          </Typography>
                          <Typography size="caption" color="tertiary">
                            {Math.round(entry.share * 100)}%
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Card>
                )}
              </>
            )}
          </LoadingState>
        </Section>
      )}
      {/* Spacer so the last card isn't hidden behind the central FAB. */}
      <View style={{ height: spacing['4xl'] }} />
    </Screen>
  );
};

export default StatsScreen;
