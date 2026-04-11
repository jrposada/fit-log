import { FunctionComponent } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EmptyState from '../../../../library/empty-state';
import { FormReadonlyProvider } from '../../../../library/form/form-readonly-context';
import FormTextArea from '../../../../library/form/form-text-area';
import FormTextInput from '../../../../library/form/form-text-input';
import LoadingState from '../../../../library/loading-state';
import Screen from '../../../../library/screen';
import Section from '../../../../library/section';
import { surfaces } from '../../../../library/theme';
import UnsavedBanner from '../../../../library/unsaved-banner';
import ClimbDetailCreateFields from './climb-detail-create-fields';
import ClimbDetailFooter from './climb-detail-footer';
import ClimbDetailImageSection from './climb-detail-image-section';
import ClimbDetailStatusCard from './climb-detail-status-card';
import useClimbDetail from './use-climb-detail';

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const detail = useClimbDetail();

  // Loading state for detail mode
  if (!detail.isCreateMode && detail.isLoadingClimb) {
    return (
      <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
    );
  }

  if (!detail.isCreateMode && !detail.climb) {
    return <EmptyState message={t('climbing.climb_not_found')} />;
  }

  const footer = detail.isEditMode ? (
    <ClimbDetailFooter
      isCreateMode={detail.isCreateMode}
      isSubmitDisabled={detail.isSubmitDisabled}
      isSaving={detail.isClimbSaving}
      isDeleting={detail.isClimbDeleting}
      onSubmit={detail.handleSubmit(detail.onSubmit)}
      onCancel={detail.handleCancelEdit}
      onDelete={detail.handleDelete}
    />
  ) : undefined;

  return (
    <FormProvider {...detail.methods}>
      <FormReadonlyProvider readonly={!detail.isEditMode}>
        <Screen
          keyboardAvoiding={detail.isEditMode}
          onContentLayout={detail.handleScrollLayout}
          footer={footer}
        >
          {detail.isEditMode && (
            <UnsavedBanner
              isDirty={detail.isDirty}
              message={t('climbing.unsaved_changes_banner')}
            />
          )}

          {detail.isCreateMode && (
            <ClimbDetailCreateFields
              sectors={detail.sectors}
              isLoadingLocation={detail.isLoadingLocation}
              selectedSector={detail.selectedSector}
              scrollHeight={detail.scrollHeight}
              imageUri={detail.imageUri}
              watchedImage={detail.watchedImage}
              watchedGrade={detail.watchedGrade}
              watchedHolds={detail.watchedHolds}
              isImageUploading={detail.isImageUploading}
              onSectorChange={detail.handleSectorChange}
              onGradeSelect={detail.handleGradeSelect}
              onHoldAdd={detail.handleHoldAdd}
              onHoldRemove={detail.handleHoldRemove}
              onSelectImage={detail.handleSelectImage}
            />
          )}

          {!detail.isCreateMode && detail.watchedImage && detail.imageUri && (
            <ClimbDetailImageSection
              imageUri={detail.imageUri}
              holds={detail.watchedHolds}
              scrollHeight={detail.scrollHeight}
              isEditMode={detail.isEditMode}
              onHoldAdd={detail.handleHoldAdd}
              onHoldRemove={detail.handleHoldRemove}
            />
          )}

          {!detail.isCreateMode && (
            <Section spacing="lg">
              <FormTextInput
                name="name"
                label={t('climbing.climb_name')}
                placeholder={t('climbing.enter_climb_name')}
                maxLength={100}
                required
                showCharacterCount
              />
            </Section>
          )}

          <Section spacing="lg">
            <FormTextArea
              name="description"
              label={t('climbing.description')}
              placeholder={t('climbing.add_description')}
              maxLength={500}
              numberOfLines={4}
            />
          </Section>

          {!detail.isCreateMode && !detail.isEditMode && (
            <ClimbDetailStatusCard
              userStatus={detail.userStatus}
              isHistoryPending={detail.isHistoryPending}
              isProjectPending={detail.isProjectPending}
              onLogSend={detail.handleLogSend}
              onToggleProject={detail.handleToggleProject}
            />
          )}
        </Screen>
      </FormReadonlyProvider>
    </FormProvider>
  );
};

export default ClimbDetailScreen;
