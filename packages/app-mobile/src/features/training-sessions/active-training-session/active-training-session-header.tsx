import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../../library/badge';
import { Icon } from '../../../library/icon';
import Stack from '../../../library/stack';
import { accent } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { SPORT_ICONS } from '../../feed/sport-icons';

interface ActiveTrainingSessionHeaderProps {
  duration: string;
  isExpanded: boolean;
}

const ActiveTrainingSessionHeader: FunctionComponent<
  ActiveTrainingSessionHeaderProps
> = ({ duration, isExpanded }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" align="center" justify="between">
      <Stack direction="horizontal" align="center" gap="sm">
        <Icon icon={SPORT_ICONS.climbing} size="md" color={accent.primary} />
        <Badge label={t('climbing.session_active_badge')} variant="success" />
      </Stack>
      <Stack direction="horizontal" align="center" gap="xs">
        <Typography size="title" weight="bold" color="accent">
          {duration}
        </Typography>
        <Icon
          icon={isExpanded ? 'expand-less' : 'expand-more'}
          size="sm"
          color={accent.primary}
        />
      </Stack>
    </Stack>
  );
};

export default ActiveTrainingSessionHeader;
