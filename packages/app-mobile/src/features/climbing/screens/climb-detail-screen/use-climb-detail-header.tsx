import { Climb } from '@shared/models/climb/climb';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '../../../../library/icon-button';
import Stack from '../../../../library/stack';
import Header from '../../../../navigation/header';
import GradeBadge from '../../components/common/grade-badge';

interface ClimbDetailHeaderProps {
  isCreateMode: boolean;
  isEditMode: boolean;
  isDirty: boolean;
  isLoadingClimb: boolean;
  climb: Climb | undefined;
  onBackPress: () => void;
  onCancelEdit: () => void;
  onEnterEditMode: () => void;
  onOpenMap: () => void;
}

const ClimbDetailHeader: FunctionComponent<ClimbDetailHeaderProps> = ({
  isCreateMode,
  isEditMode,
  isDirty,
  isLoadingClimb,
  climb,
  onBackPress,
  onCancelEdit,
  onEnterEditMode,
  onOpenMap,
}) => {
  const { t } = useTranslation();

  return (
    <Header
      title={isCreateMode ? t('climbing.create_climb_title') : climb?.name}
      subtitle={
        !isCreateMode &&
        climb &&
        `${climb.location.name} · ${climb.sector.name}`
      }
      extra={!isCreateMode && climb && <GradeBadge grade={climb.grade} />}
      action={
        !isCreateMode && (
          <Stack direction="horizontal" gap="sm">
            <IconButton icon="📍" onPress={onOpenMap} />
            <IconButton
              icon={isEditMode && isDirty ? '⚠️' : '✏️'}
              variant={isEditMode ? 'primary' : 'default'}
              onPress={isEditMode ? onCancelEdit : onEnterEditMode}
            />
          </Stack>
        )
      }
      loading={isLoadingClimb}
      mode="modal"
      back
      onBackPress={onBackPress}
    />
  );
};

export default ClimbDetailHeader;
