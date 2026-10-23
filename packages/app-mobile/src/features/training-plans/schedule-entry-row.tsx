import { PlanEntryStatus } from '@jrposada/fit-log-shared/common/training-plans/plan-entry-status';
import {
  TrainingPlanScheduleEntry,
  TrainingPlanSessionTemplate,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeVariant } from '../../library/badge';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';

const STATUS_BADGE_VARIANTS: Record<PlanEntryStatus, BadgeVariant> = {
  done: 'success',
  skipped: 'warning',
  upcoming: 'info',
};

type ScheduleEntryRowProps = {
  entry: TrainingPlanScheduleEntry;
  /** Missing for rest days. */
  template?: TrainingPlanSessionTemplate;
  status?: PlanEntryStatus;
  showDay?: boolean;
};

const ScheduleEntryRow: FunctionComponent<ScheduleEntryRowProps> = ({
  entry,
  template,
  status,
  showDay = false,
}) => {
  const { t } = useTranslation();

  const slot = t(`training_plans.slot_${entry.slot}`);
  const isOptional = entry.optional || template?.optional;

  return (
    <Stack gap="2xs">
      <Stack direction="horizontal" align="center" gap="sm">
        <Typography size="caption" color="tertiary">
          {showDay ? `${t(`training_plans.day_${entry.day}`)} · ${slot}` : slot}
        </Typography>
        <Typography size="body" weight="semibold" style={{ flex: 1 }}>
          {template?.name ?? t('training_plans.rest_day')}
        </Typography>
        {isOptional && (
          <Typography size="caption" color="tertiary">
            {t('training_plans.optional')}
          </Typography>
        )}
        {status && (
          <Badge
            label={t(`training_plans.status_${status}`)}
            variant={STATUS_BADGE_VARIANTS[status]}
          />
        )}
      </Stack>
      {entry.notes && (
        <Typography size="callout" color="secondary">
          {entry.notes}
        </Typography>
      )}
    </Stack>
  );
};

export default ScheduleEntryRow;
