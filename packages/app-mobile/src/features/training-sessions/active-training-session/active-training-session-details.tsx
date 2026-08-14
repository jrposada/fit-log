import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import Stack from '../../../library/stack';
import { Typography } from '../../../library/typography';

interface ActiveTrainingSessionDetailsProps {
  climbsCount: number;
  isStopping: boolean;
  onStop: () => void;
}

const ActiveTrainingSessionDetails: FunctionComponent<
  ActiveTrainingSessionDetailsProps
> = ({ climbsCount, isStopping, onStop }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="md">
      <Stack gap="2xs">
        <Typography
          size="overline"
          color="secondary"
          style={{ textTransform: 'uppercase' }}
        >
          {t('climbing.session_progress_label')}
        </Typography>
        <Typography size="heading" weight="bold">
          {t('climbing.climbs_count', { count: climbsCount })}
        </Typography>
      </Stack>

      <Button
        title={t('climbing.session_stop_button')}
        variant="destructive"
        icon="⏹️"
        fullWidth
        onPress={onStop}
        disabled={isStopping}
      />
    </Stack>
  );
};

export default ActiveTrainingSessionDetails;
