import { FunctionComponent } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import Button from '../../../../library/button';
import EmptyState from '../../../../library/empty-state';
import { FormReadonlyProvider } from '../../../../library/form/form-readonly-context';
import FormTextArea from '../../../../library/form/form-text-area';
import FormTextInput from '../../../../library/form/form-text-input';
import LoadingState from '../../../../library/loading-state';
import Screen from '../../../../library/screen';
import Section from '../../../../library/section';
import Select from '../../../../library/select';
import { surfaces } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';
import UnsavedBanner from '../../../../library/unsaved-banner';
import ClimbImage from '../../components/climb-detail/climb-image';
import GradeBadge from '../../components/common/grade-badge';
import ClimbDetailFooter from './climb-detail-footer';
import { GRADE_OPTIONS } from './climb-detail-screen.types';
import ClimbDetailStatusCard from './climb-detail-status-card';
import useClimbDetail from './use-climb-detail';

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const detail = useClimbDetail();

  if (!detail.isCreateMode && detail.isLoadingClimb) {
    return (
      <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
    );
  }

  if (!detail.isCreateMode && !detail.climb) {
    return <EmptyState message={t('climbing.climb_not_found')} />;
  }

  return (
    <FormProvider {...detail.methods}>
      <FormReadonlyProvider readonly={!detail.isEditMode}>
        <Screen
          keyboardAvoiding={detail.isEditMode}
          onContentLayout={detail.handleScrollLayout}
          footer={
            detail.isEditMode && (
              <ClimbDetailFooter
                isCreateMode={detail.isCreateMode}
                isSubmitDisabled={detail.isSubmitDisabled}
                isSaving={detail.isClimbSaving}
                isDeleting={detail.isClimbDeleting}
                onSubmit={detail.handleSubmit(detail.onSubmit)}
                onCancel={detail.handleCancelEdit}
                onDelete={detail.handleDelete}
              />
            )
          }
        >
          {detail.isEditMode && (
            <UnsavedBanner
              isDirty={detail.isDirty}
              message={t('climbing.unsaved_changes_banner')}
            />
          )}

          {!detail.isCreateMode && detail.watchedImage && detail.imageUri && (
            <Animated.View layout={LinearTransition}>
              {detail.isEditMode && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <Typography
                    size="callout"
                    color="secondary"
                    style={{ textAlign: 'center', marginTop: 8 }}
                  >
                    {t('climbing.mark_holds_hint')}
                  </Typography>
                </Animated.View>
              )}
              <ClimbImage
                source={{ uri: detail.imageUri }}
                holds={detail.watchedHolds}
                style={{
                  height: detail.scrollHeight,
                }}
                editable={detail.isEditMode}
                onHoldAdd={detail.handleHoldAdd}
                onHoldRemove={detail.handleHoldRemove}
              />
            </Animated.View>
          )}

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

          <Section spacing="lg">
            <FormTextArea
              name="description"
              label={t('climbing.description')}
              placeholder={t('climbing.add_description')}
              maxLength={500}
              numberOfLines={4}
            />
          </Section>

          {detail.isCreateMode && (
            <>
              <Section spacing="lg">
                <Typography weight="semibold" style={{ marginBottom: 8 }}>
                  {t('climbing.grade')}
                </Typography>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <GradeBadge
                      key={grade}
                      grade={grade}
                      variant={
                        detail.watchedGrade === grade ? 'filled' : 'ghost'
                      }
                      onPress={() => detail.handleGradeSelect(grade)}
                    />
                  ))}
                </ScrollView>
              </Section>

              <Section spacing="lg">
                <LoadingState isLoading={detail.isLoadingLocation}>
                  <Typography weight="semibold" style={{ marginBottom: 8 }}>
                    {t('climbing.sector')}
                  </Typography>
                  <Select
                    options={detail.sectors.map((s) => s.name)}
                    value={detail.selectedSector?.name || ''}
                    onChange={detail.handleSectorChange}
                    placeholder={t('climbing.select_sector')}
                    searchPlaceholder={t('climbing.search_sector')}
                    closeButtonLabel={t('actions.close')}
                    emptyStateMessage={t('climbing.no_sectors_found')}
                  />
                </LoadingState>
              </Section>

              <Section spacing="lg">
                <Typography weight="semibold" style={{ marginBottom: 8 }}>
                  {t('climbing.select_image')}
                </Typography>
                {detail.watchedImage && detail.imageUri ? (
                  <View>
                    <ClimbImage
                      source={{ uri: detail.imageUri }}
                      holds={detail.watchedHolds}
                      style={{ height: detail.scrollHeight * 0.6 }}
                      editable
                      onHoldAdd={detail.handleHoldAdd}
                      onHoldRemove={detail.handleHoldRemove}
                    />
                    <Typography
                      size="callout"
                      color="secondary"
                      style={{ textAlign: 'center', marginTop: 8 }}
                    >
                      {t('climbing.mark_holds_hint')}
                    </Typography>
                  </View>
                ) : (
                  <Button
                    variant="primary"
                    title={
                      detail.isImageUploading
                        ? t('climbing.uploading_image')
                        : t('climbing.select_image')
                    }
                    onPress={detail.handleSelectImage}
                    disabled={detail.isImageUploading}
                  />
                )}
              </Section>
            </>
          )}

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
