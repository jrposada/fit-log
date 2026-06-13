import {
  ClimbGrade,
  GRADE_OPTIONS,
} from '@jrposada/fit-log-shared/common/climbs/grades';
import { useClimbHistoriesStats } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories-stats';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, LineChart } from 'react-native-gifted-charts';

import Card from '../../../../library/card';
import EmptyState from '../../../../library/empty-state';
import LoadingState from '../../../../library/loading-state';
import Measure from '../../../../library/measure';
import Section from '../../../../library/section';
import Separator from '../../../../library/separator';
import Stack from '../../../../library/stack';
import Swatch from '../../../../library/swatch';
import { ink, palette, spacing, typography } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';

/** Grades are ordered by their position in GRADE_OPTIONS, never alphabetically. */
const gradeIndex = (grade: ClimbGrade): number =>
  (GRADE_OPTIONS as readonly string[]).indexOf(grade);

/**
 * Period keys arrive as "2026-06" (month) or "2026-W23" (ISO week). The full
 * key is too wide for an x-axis tick and gets clipped to a useless fragment, so
 * collapse it to a short, readable label. Month names come from the locale's
 * short-month format (via Intl), so they follow the configured language.
 */
const formatPeriodLabel = (
  period: string,
  monthFormatter: Intl.DateTimeFormat
): string => {
  const month = /^(\d{4})-(\d{2})$/.exec(period);
  if (month) {
    const date = new Date(Number(month[1]), Number(month[2]) - 1, 1);
    return monthFormatter.format(date);
  }
  const week = /^\d{4}-W(\d{2})$/.exec(period);
  if (week) {
    return `W${week[1]}`;
  }
  return period;
};

/** Width gifted-charts reserves to the left of the plot for y-axis labels. */
const Y_AXIS_GUTTER = spacing['3xl'];

const CARD_COLUMNS = 3;
const CARD_GAP = spacing.sm;

// Chart colors come from the theme palette so charts stay on-brand. Sends are
// always green and the not-sent remainder always amber, across every chart.
const CHART_COLORS = {
  sends: palette.green,
  attempts: palette.amber,
  progressionBest: palette.blue,
  progressionAvg: palette.plum,
  axis: ink.tertiary,
  rules: ink.disabled,
};

type DashboardCardData = {
  id: string;
  icon: string;
  color: string;
  value: string;
  label: string;
  secondary?: string;
};

const DashboardCard: FunctionComponent<{
  card: DashboardCardData;
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
      {card.secondary && (
        <Typography size="caption" color="tertiary" align="center">
          {card.secondary}
        </Typography>
      )}
    </Stack>
  </Card>
);

const ChartLegend: FunctionComponent<{
  items: { label: string; color: string }[];
}> = ({ items }) => (
  <Stack direction="horizontal" gap="lg">
    {items.map((item) => (
      <Stack key={item.label} direction="horizontal" align="center" gap="xs">
        <Swatch color={item.color} />
        <Typography size="caption" color="secondary">
          {item.label}
        </Typography>
      </Stack>
    ))}
  </Stack>
);

/**
 * A titled, elevated card hosting one chart — the Stats-tab equivalent of the
 * ClimbCards that sit inside the Logbook/Browse Sections. The chart is sized to
 * the card's real inner width via Measure.
 */
const ChartCard: FunctionComponent<{
  title: string;
  legend: { label: string; color: string }[];
  children: (width: number) => ReactNode;
}> = ({ title, legend, children }) => (
  <Card variant="elevated" size="lg">
    <Stack gap="sm">
      <Typography size="body" weight="semibold">
        {title}
      </Typography>
      <ChartLegend items={legend} />
      <Measure>{children}</Measure>
    </Stack>
  </Card>
);

const StatsTab: FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  // Short month names follow the configured language (e.g. Jun / juin / Jun.).
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { month: 'short' }),
    [i18n.language]
  );

  // v1: no filters — all-time, all locations. The endpoint supports scoping
  // (location/date) so a filter UI can be layered on later.
  const { data, isLoading } = useClimbHistoriesStats();

  const summary = data?.summary;

  const axisTextStyle = {
    color: CHART_COLORS.axis,
    fontSize: typography.caption.fontSize,
  };

  // --- Grade distribution: one stacked bar per grade (sends + attempts) ----
  const gradeStackData = useMemo(() => {
    const entries = data?.gradeDistribution ?? [];
    return [...entries]
      .sort((a, b) => gradeIndex(a.grade) - gradeIndex(b.grade))
      .map((entry) => ({
        label: entry.grade,
        stacks: [
          { value: entry.sends, color: CHART_COLORS.sends },
          { value: entry.attempts, color: CHART_COLORS.attempts },
        ],
      }));
  }, [data?.gradeDistribution]);

  // --- Progression: two non-cumulative lines per period — the hardest grade
  // sent (best) and the mean grade sent (average). Both rise AND fall with
  // form, so a weaker period reads honestly as a dip. Only periods with a send
  // are plotted (a no-send period has no grade to show).
  const progressionData = useMemo(() => {
    const points = (data?.progression ?? [])
      .map((entry) => ({
        period: entry.period,
        // Custom (non-V) grades fall outside GRADE_OPTIONS → treated as no-send.
        best: entry.hardestGrade ? gradeIndex(entry.hardestGrade) : -1,
        avg: entry.avgGradeIndex,
      }))
      .filter((point) => point.best >= 0);

    if (points.length === 0) {
      return null;
    }

    // Axis window spans both lines; average is fractional so floor the bottom
    // and ceil the top to land on whole grade ticks.
    const values = points.flatMap((point) => [
      point.best,
      point.avg ?? point.best,
    ]);
    const minIndex = Math.floor(Math.min(...values));
    const maxIndex = Math.ceil(Math.max(...values));
    const sections = Math.max(1, maxIndex - minIndex);

    // Plot RELATIVE to minIndex so the axis range, step, and label count stay
    // consistent (maxValue === sections === noOfSections * stepValue), which
    // stops gifted-charts from drawing its own numeric ticks over the grades.
    const bestLine = points.map((point) => ({
      value: point.best - minIndex,
      label: formatPeriodLabel(point.period, monthFormatter),
    }));
    const avgLine = points.map((point) => ({
      value: (point.avg ?? point.best) - minIndex,
    }));

    const yAxisLabelTexts = Array.from(
      { length: sections + 1 },
      (_, i) => GRADE_OPTIONS[minIndex + i] ?? ''
    );

    return {
      bestLine,
      avgLine,
      maxValue: sections,
      sections,
      yAxisLabelTexts,
    };
  }, [data?.progression, monthFormatter]);

  // --- Activity over time: one stacked bar per period = total climbs, with
  // the sent portion shaded within it (sends ⊆ climbs). ---------------------
  const activityStackData = useMemo(
    () =>
      (data?.activity ?? []).map((entry) => ({
        label: formatPeriodLabel(entry.period, monthFormatter),
        stacks: [
          { value: entry.sends, color: CHART_COLORS.sends },
          {
            value: Math.max(0, entry.climbs - entry.sends),
            color: CHART_COLORS.attempts,
          },
        ],
      })),
    [data?.activity, monthFormatter]
  );

  // Personal best + average session time share the hero.
  const heroPersonalBest =
    summary?.hardestGrade ?? t('climbing.stats_personal_best_empty');
  const heroAvgTime =
    data?.sessions?.avgDurationMinutes == null
      ? t('climbing.stats_personal_best_empty')
      : t('climbing.stats_duration_minutes', {
          count: Math.round(data.sessions.avgDurationMinutes),
        });

  // Three consolidated cards: performance (sends/flashes/attempts), projects,
  // and sessions (count + climbs-per-session).
  const cards = useMemo<DashboardCardData[]>(() => {
    if (!summary || !data?.sessions) {
      return [];
    }
    const { sessions } = data;

    return [
      {
        id: 'performance',
        icon: '🏁',
        color: palette.green,
        value: String(summary.sends),
        label: t('climbing.stats_card_sends'),
        secondary: t('climbing.stats_perf_secondary', {
          flashes: summary.flashes,
          attempts: summary.totalAttempts,
        }),
      },
      {
        id: 'projects',
        icon: '🚧',
        color: palette.plum,
        value: String(summary.projects),
        label: t('climbing.stats_card_projects'),
      },
      {
        id: 'sessions',
        icon: '🗓️',
        color: palette.blue,
        value: String(sessions.total),
        label: t('climbing.stats_sessions_total'),
        secondary: t('climbing.stats_sessions_secondary', {
          value: sessions.avgClimbsPerSession.toFixed(1),
        }),
      },
    ];
  }, [summary, data, t]);

  const sendsAttemptsLegend = [
    { label: t('climbing.stats_legend_sends'), color: CHART_COLORS.sends },
    {
      label: t('climbing.stats_legend_attempts'),
      color: CHART_COLORS.attempts,
    },
  ];

  const showEmpty = !summary || summary.totalClimbs === 0;

  return (
    <Section gap="md">
      <LoadingState isLoading={isLoading}>
        {showEmpty ? (
          <EmptyState message={t('climbing.stats_empty')} />
        ) : (
          <>
            <Stack gap="sm">
              <Card variant="elevated" size="lg" highlight={palette.gold}>
                <Stack direction="horizontal" align="center" gap="sm">
                  <Stack flex align="center" gap="2xs">
                    <Typography size="heading">🏆</Typography>
                    <Typography size="jumbo" style={{ color: palette.gold }}>
                      {heroPersonalBest}
                    </Typography>
                    <Typography size="overline" color="secondary">
                      {t('climbing.stats_card_personal_best')}
                    </Typography>
                  </Stack>

                  <Separator direction="vertical" inset="xs" />

                  <Stack flex align="center" gap="2xs">
                    <Typography size="heading">⏱️</Typography>
                    <Typography size="jumbo">{heroAvgTime}</Typography>
                    <Typography size="overline" color="secondary">
                      {t('climbing.stats_sessions_avg_duration')}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>

              <Measure>
                {(width) => {
                  const cardWidth =
                    (width - CARD_GAP * (CARD_COLUMNS - 1)) / CARD_COLUMNS;
                  return (
                    <Stack direction="horizontal" gap="sm">
                      {cards.map((card) => (
                        <DashboardCard
                          key={card.id}
                          card={card}
                          width={cardWidth}
                        />
                      ))}
                    </Stack>
                  );
                }}
              </Measure>
            </Stack>

            {progressionData && (
              <ChartCard
                title={t('climbing.stats_progression')}
                legend={[
                  {
                    label: t('climbing.stats_progression_best'),
                    color: CHART_COLORS.progressionBest,
                  },
                  {
                    label: t('climbing.stats_progression_average'),
                    color: CHART_COLORS.progressionAvg,
                  },
                ]}
              >
                {(width) => (
                  <LineChart
                    data={progressionData.bestLine}
                    data2={progressionData.avgLine}
                    width={width - Y_AXIS_GUTTER}
                    yAxisLabelWidth={Y_AXIS_GUTTER}
                    thickness={3}
                    color={CHART_COLORS.progressionBest}
                    dataPointsColor={CHART_COLORS.progressionBest}
                    thickness2={2}
                    color2={CHART_COLORS.progressionAvg}
                    dataPointsColor2={CHART_COLORS.progressionAvg}
                    maxValue={progressionData.maxValue}
                    noOfSections={progressionData.sections}
                    stepValue={1}
                    yAxisLabelTexts={progressionData.yAxisLabelTexts}
                    yAxisColor={CHART_COLORS.axis}
                    xAxisColor={CHART_COLORS.axis}
                    rulesColor={CHART_COLORS.rules}
                    yAxisTextStyle={axisTextStyle}
                    xAxisLabelTextStyle={axisTextStyle}
                    initialSpacing={spacing.md}
                  />
                )}
              </ChartCard>
            )}

            {gradeStackData.length > 0 && (
              <ChartCard
                title={t('climbing.stats_grade_distribution')}
                legend={sendsAttemptsLegend}
              >
                {(width) => (
                  <BarChart
                    stackData={gradeStackData}
                    width={width - Y_AXIS_GUTTER}
                    yAxisLabelWidth={Y_AXIS_GUTTER}
                    barWidth={spacing.xl}
                    spacing={spacing.md}
                    initialSpacing={spacing.md}
                    yAxisColor={CHART_COLORS.axis}
                    xAxisColor={CHART_COLORS.axis}
                    rulesColor={CHART_COLORS.rules}
                    yAxisTextStyle={axisTextStyle}
                    xAxisLabelTextStyle={axisTextStyle}
                  />
                )}
              </ChartCard>
            )}

            {activityStackData.length > 0 && (
              <ChartCard
                title={t('climbing.stats_activity')}
                legend={sendsAttemptsLegend}
              >
                {(width) => (
                  <BarChart
                    stackData={activityStackData}
                    width={width - Y_AXIS_GUTTER}
                    yAxisLabelWidth={Y_AXIS_GUTTER}
                    barWidth={spacing.xl}
                    spacing={spacing.md}
                    initialSpacing={spacing.md}
                    yAxisColor={CHART_COLORS.axis}
                    xAxisColor={CHART_COLORS.axis}
                    rulesColor={CHART_COLORS.rules}
                    yAxisTextStyle={axisTextStyle}
                    xAxisLabelTextStyle={axisTextStyle}
                  />
                )}
              </ChartCard>
            )}
          </>
        )}
      </LoadingState>
    </Section>
  );
};

export default StatsTab;
