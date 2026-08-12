import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../library/badge';
import Card from '../../library/card';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { accent } from '../../library/theme';
import { Typography } from '../../library/typography';
import { SPORT_ICONS } from '../feed/sport-icons';

interface ActiveTrainingSessionCardProps {
  session: TrainingSession;
  onPress: () => void;
}

function formatElapsed(
  startedAt: string,
  t: ReturnType<typeof useTranslation>['t']
): string {
  const minutes = Math.max(
    0,
    Math.round((Date.now() - new Date(startedAt).getTime()) / 60000)
  );

  if (minutes < 60) {
    return t('climbing.session_started_minutes_ago', { count: minutes });
  }
  return t('climbing.session_started_hours_ago', {
    count: Math.round(minutes / 60),
  });
}

const ActiveTrainingSessionCard: FunctionComponent<
  ActiveTrainingSessionCardProps
> = ({ session, onPress }) => {
  const { t } = useTranslation();

  return (
    <Card variant="elevatedStrong" highlight={accent.primary} onPress={onPress}>
      <Stack gap="xs">
        <Stack direction="horizontal" align="center" justify="between">
          <Typography size="title" weight="semibold" style={{ flex: 1 }}>
            {session.title}
          </Typography>
          <Badge label={t('climbing.session_active_badge')} variant="success" />
        </Stack>

        <Stack direction="horizontal" align="center" gap="sm">
          <Typography size="callout" color="secondary">
            {SPORT_ICONS.climbing}{' '}
            {t('climbing.climbs_count', {
              count: session.climbHistories.length,
            })}
          </Typography>
          <Separator direction="dot" />
          <Typography size="callout" color="secondary">
            {formatElapsed(session.startedAt, t)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ActiveTrainingSessionCard;
