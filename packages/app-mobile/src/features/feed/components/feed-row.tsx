import { SessionSummary } from '@jrposada/fit-log-shared/models/feed/feed';
import { formatRelativeDate } from '@jrposada/fit-log-shared-react/beautifiers/date';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../../library/card';
import Separator from '../../../library/separator';
import Stack from '../../../library/stack';
import { Typography } from '../../../library/typography';
import { SPORT_ICONS } from '../sport-icons';

interface FeedRowProps {
  session: SessionSummary;
  onPress?: (session: SessionSummary) => void;
}

const FeedRow: FunctionComponent<FeedRowProps> = ({ session, onPress }) => {
  const { t } = useTranslation();

  return (
    <Card onPress={onPress ? () => onPress(session) : undefined}>
      <Stack direction="horizontal" align="center" gap="sm" spacer="xs">
        <Typography size="title">{SPORT_ICONS[session.sport]}</Typography>
        <Typography size="body" weight="semibold" style={{ flex: 1 }}>
          {session.title}
        </Typography>
        <Typography size="caption" color="tertiary">
          {formatRelativeDate(session.startedAt, t)}
        </Typography>
      </Stack>

      <Stack direction="horizontal" align="center" gap="sm">
        <Typography size="callout" color="secondary">
          {session.summary.headline}
        </Typography>
        {session.summary.metric && (
          <>
            <Separator direction="dot" />
            <Typography size="callout" color="secondary">
              {session.summary.metric.label}: {session.summary.metric.value}
            </Typography>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default FeedRow;
