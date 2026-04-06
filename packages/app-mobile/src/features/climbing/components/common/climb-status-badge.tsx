import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../../../library/badge';

interface ClimbStatusBadgeProps {
  status: ClimbHistory['status'];
  isProject?: boolean;
}

const ClimbStatusBadge: FunctionComponent<ClimbStatusBadgeProps> = ({
  status,
  isProject,
}) => {
  const { t } = useTranslation();

  if (status === 'send') {
    return <Badge label={t('climbing.status_sent')} variant="success" />;
  }

  if (status === 'flash') {
    return <Badge label={t('climbing.status_flash')} variant="success" />;
  }

  if (isProject) {
    return <Badge label={t('climbing.status_project_label')} variant="info" />;
  }

  return null;
};

export default ClimbStatusBadge;
