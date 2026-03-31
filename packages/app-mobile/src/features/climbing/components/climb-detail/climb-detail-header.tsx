import { useRoute } from '@react-navigation/native';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../../../navigation/header';
import { ClimbDetailRouteProp } from '../../screens/climb-detail-screen';
import GradeBadge from '../common/grade-badge';

const ClimbDetailHeader: FunctionComponent = () => {
  const { t } = useTranslation();
  const route = useRoute<ClimbDetailRouteProp>();

  const climbId = route.params?.climbId;
  const isCreateMode = !climbId;

  const { data: climb, isLoading } = useClimbsById({
    id: climbId || '',
  });

  return (
    <Header
      title={isCreateMode ? t('climbing.create_climb_title') : climb?.name}
      extra={
        !isCreateMode && climb ? <GradeBadge grade={climb.grade} /> : undefined
      }
      loading={!isCreateMode && isLoading}
      mode="modal"
      back
    />
  );
};

export default ClimbDetailHeader;
