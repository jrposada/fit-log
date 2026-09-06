import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../../library/badge';
import { Icon } from '../../../library/icon';
import IconButton from '../../../library/icon-button';
import Stack from '../../../library/stack';
import { accent } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { SPORT_ICONS } from '../../feed/sport-icons';

interface ActiveTrainingSessionHeaderProps {
  duration: string;
  isExpanded: boolean;
  onOpenLogATry: () => void;
}

const ActiveTrainingSessionHeader: FunctionComponent<
  ActiveTrainingSessionHeaderProps
> = ({ duration, isExpanded, onOpenLogATry }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" align="center" justify="between">
      <Stack direction="horizontal" align="center" gap="sm">
        <Icon icon={SPORT_ICONS.climbing} size="md" color={accent.primary} />
        <Badge label={t('climbing.session_active_badge')} variant="success" />
      </Stack>
      <Stack direction="horizontal" align="center" gap="xs">
        <IconButton
          icon="add"
          variant="ghost"
          size="sm"
          onPress={onOpenLogATry}
        />
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
