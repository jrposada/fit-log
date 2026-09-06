import { ClimbHistoryStatus } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import Stack from '../../../library/stack';

export interface OutcomePickerProps {
  value: ClimbHistoryStatus;
  onChange: (status: ClimbHistoryStatus) => void;
  disabled?: boolean;
}

const OUTCOMES: ClimbHistoryStatus[] = ['flash', 'send', 'attempt'];

const OutcomePicker: FunctionComponent<OutcomePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const labels: Record<ClimbHistoryStatus, string> = {
    flash: t('climbing.log_a_try_outcome_flash'),
    send: t('climbing.log_a_try_outcome_send'),
    attempt: t('climbing.log_a_try_outcome_try'),
  };

  return (
    <Stack direction="horizontal" gap="sm">
      {OUTCOMES.map((outcome) => (
        <Button
          key={outcome}
          title={labels[outcome]}
          variant={value === outcome ? 'primary' : 'outline'}
          size="sm"
          disabled={disabled}
          onPress={() => onChange(outcome)}
          style={{ flex: 1 }}
        />
      ))}
    </Stack>
  );
};

export default OutcomePicker;
