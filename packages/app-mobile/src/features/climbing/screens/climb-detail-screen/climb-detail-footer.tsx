import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../library/button';
import IconButton from '../../../../library/icon-button';
import Section from '../../../../library/section';
import Stack from '../../../../library/stack';
import { Selection } from '../../components/climb-detail/climb-image/climb-image';
import ClimbImageEditCard from '../../components/climb-detail/climb-image/climb-image-edit-card';

type ClimbDetailFooterProps = {
  isCreateMode: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isHistoryPending: boolean;
  isProject: boolean;
  isProjectPending: boolean;
  isCompleted: boolean;
  selection: Selection;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  handleLogSend: () => void;
  onToggleProject: () => void;
  onSelectionMove: (dx: number, dy: number) => void;
  onSelectionResize: (scaleFactor: number) => void;
};

const ClimbDetailFooter: FunctionComponent<ClimbDetailFooterProps> = ({
  isCreateMode,
  isEditMode,
  isSubmitDisabled,
  isSaving,
  isDeleting,
  isHistoryPending,
  isProject,
  isProjectPending,
  isCompleted,
  selection,
  onSubmit,
  onCancel,
  onDelete,
  handleLogSend,
  onToggleProject: handleToggleProject,
  onSelectionMove: handleSelectionMove,
  onSelectionResize: handleSelectionResize,
}) => {
  const { t } = useTranslation();

  if (isCreateMode) {
    return (
      <Button
        variant="primary"
        title={
          isSaving ? t('climbing.saving') : t('climbing.create_climb_title')
        }
        onPress={onSubmit}
        disabled={isSubmitDisabled}
      />
    );
  }

  if (selection) {
    return (
      <ClimbImageEditCard
        selectionType={selection.type}
        onMove={handleSelectionMove}
        onResize={selection?.type === 'hold' && handleSelectionResize}
      />
    );
  }

  if (isEditMode) {
    return (
      <Stack direction="horizontal" gap="md">
        <IconButton
          variant="destructive"
          icon="🗑️"
          size="lg"
          onPress={onDelete}
          disabled={isDeleting}
        />
        <Button
          fullWidth
          variant="outline"
          title={t('actions.cancel')}
          onPress={onCancel}
        />
        <Button
          fullWidth
          variant="primary"
          title={isSaving ? t('climbing.saving') : t('actions.save')}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
        />
      </Stack>
    );
  }

  if (!isCompleted) {
    return (
      <Section variant="transparent" direction="horizontal" gap="md">
        <Button
          fullWidth
          variant="primary"
          title={`✓ ${t('climbing.browse_log_send')}`}
          onPress={handleLogSend}
          disabled={isHistoryPending}
        />
        <Button
          fullWidth
          variant="outline"
          title={
            isProject
              ? t('climbing.unproject_action')
              : `+ ${t('climbing.project_action')}`
          }
          onPress={handleToggleProject}
          disabled={isProjectPending}
        />
      </Section>
    );
  }

  return null;
};

export default ClimbDetailFooter;
