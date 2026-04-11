import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from '../../../../library/button';

type ClimbDetailFooterProps = {
  isCreateMode: boolean;
  isSubmitDisabled: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

const ClimbDetailFooter: FunctionComponent<ClimbDetailFooterProps> = ({
  isCreateMode,
  isSubmitDisabled,
  isSaving,
  isDeleting,
  onSubmit,
  onCancel,
  onDelete,
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

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button
          variant="outline"
          title={t('actions.cancel')}
          onPress={onCancel}
          style={{ flex: 1 }}
        />
        <Button
          variant="primary"
          title={isSaving ? t('climbing.saving') : t('actions.save')}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={{ flex: 1 }}
        />
      </View>
      <Button
        variant="destructive"
        title={
          isDeleting
            ? t('climbing.deleting')
            : t('climbing.delete_climb_button')
        }
        onPress={onDelete}
        disabled={isDeleting}
      />
    </View>
  );
};

export default ClimbDetailFooter;
