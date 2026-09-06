import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import Stack from '../../../library/stack';
import Stepper from '../../../library/stepper';
import { Typography } from '../../../library/typography';

interface ActiveTrainingSessionDetailsProps {
  climbsCount: number;
  currentClimb?: { name: string; grade: string };
  attempts: number;
  onChangeAttempts?: (attempts: number) => void;
  isUpdatingAttempts: boolean;
  isStopping: boolean;
  onStop: () => void;
  onOpenDashboard: () => void;
}

const ActiveTrainingSessionDetails: FunctionComponent<
  ActiveTrainingSessionDetailsProps
> = ({
  climbsCount,
  currentClimb,
  attempts,
  onChangeAttempts,
  isUpdatingAttempts,
  isStopping,
  onStop,
  onOpenDashboard,
}) => {
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

      {onChangeAttempts && currentClimb && (
        <Stack direction="horizontal" align="center" justify="between">
          <Stack gap="2xs">
            <Typography
              size="overline"
              color="secondary"
              style={{ textTransform: 'uppercase' }}
            >
              {t('climbing.session_current_climb_label')}
            </Typography>
            <Typography weight="semibold">
              {currentClimb.grade} {currentClimb.name}
            </Typography>
          </Stack>
          <Stepper
            value={attempts}
            onChange={onChangeAttempts}
            min={1}
            disabled={isUpdatingAttempts}
          />
        </Stack>
      )}

      <Button
        title={t('climbing.session_view_dashboard_button')}
        variant="outline"
        icon="dashboard"
        fullWidth
        onPress={onOpenDashboard}
      />

      <Button
        title={t('climbing.session_stop_button')}
        variant="destructive"
        icon="stop"
        fullWidth
        onPress={onStop}
        disabled={isStopping}
      />
    </Stack>
  );
};

export default ActiveTrainingSessionDetails;
