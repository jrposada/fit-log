import { GRADE_OPTIONS } from '@shared/models/climb/climb-constants';
import { FunctionComponent } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import Button from '../../../../library/button';
import EmptyState from '../../../../library/empty-state';
import { FormReadonlyProvider } from '../../../../library/form/form-readonly-context';
import FormTextArea from '../../../../library/form/form-text-area';
import FormTextInput from '../../../../library/form/form-text-input';
import LoadingState from '../../../../library/loading-state';
import Screen from '../../../../library/screen';
import Section from '../../../../library/section';
import Select from '../../../../library/select';
import Stack from '../../../../library/stack';
import { surfaces } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';
import ClimbImage from '../../components/climb-detail/climb-image';
import GradeBadge from '../../components/common/grade-badge';
import ClimbDetailFooter from './climb-detail-footer';
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
          presentation="modal"
          footerVariant={
            detail.isEditMode && detail.selection ? 'transparent' : 'default'
          }
          keyboardAvoiding={detail.isEditMode}
          onContentLayout={detail.handleScrollLayout}
          footer={
            <ClimbDetailFooter
              isCreateMode={detail.isCreateMode}
              isEditMode={detail.isEditMode}
              isSubmitDisabled={detail.isSubmitDisabled}
              isSaving={detail.isClimbSaving}
              isDeleting={detail.isClimbDeleting}
              isHistoryPending={detail.isHistoryPending}
              isProject={detail.userStatus?.isProject || false}
              isProjectPending={detail.isProjectPending}
              isCompleted={['flash', 'send'].includes(
                detail.userStatus?.status ?? ''
              )}
              selection={detail.selection}
              onSubmit={detail.handleSubmit(detail.onSubmit)}
              onCancel={detail.handleCancelEdit}
              onDelete={detail.handleDelete}
              handleLogSend={detail.handleLogSend}
              onToggleProject={detail.handleToggleProject}
              onSelectionMove={detail.handleSelectionMove}
              onSelectionResize={detail.handleSelectionResize}
            />
          }
        >
          {detail.watchedImage && detail.imageUri ? (
            <Animated.View layout={LinearTransition}>
              <ClimbImage
                source={{ uri: detail.imageUri }}
                holds={detail.watchedHolds}
                spline={detail.watchedSpline}
                selection={detail.selection}
                onSelectionChange={detail.setSelection}
                style={{
                  height: detail.scrollHeight,
                }}
                editable={detail.isEditMode}
                onHoldAdd={detail.handleHoldAdd}
                onHoldRemove={detail.handleHoldRemove}
                onSplinePointAdd={detail.handleSplinePointAdd}
                onSplinePointRemove={detail.handleSplinePointRemove}
              />
            </Animated.View>
          ) : (
            <Section title={t('climbing.select_image')}>
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
            </Section>
          )}

          <Stack padding="lg" gap="lg">
            <Section>
              <FormTextInput
                name="name"
                label={t('climbing.climb_name')}
                placeholder={t('climbing.enter_climb_name')}
                maxLength={100}
                required
                showCharacterCount
              />
            </Section>

            <Section>
              <FormTextArea
                name="description"
                label={t('climbing.description')}
                placeholder={t('climbing.add_description')}
                maxLength={500}
                numberOfLines={4}
              />
            </Section>

            {detail.isEditMode && (
              <Section title={t('climbing.grade')}>
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
            )}

            {detail.isCreateMode && (
              <Section title={t('climbing.sector')}>
                <LoadingState isLoading={detail.isLoadingLocation}>
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
            )}

            {!detail.isCreateMode && !detail.isEditMode && (
              <Section title={t('climbing.browse_your_status')}>
                <Typography size="callout" color="secondary">
                  {detail.userStatus?.status === 'flash' &&
                    `✓ ${t('climbing.status_flash')}`}
                  {detail.userStatus?.status === 'send' &&
                    `✓ ${t('climbing.status_sent')}: ${t('climbing.attempts_count', { count: detail.attempts })}`}
                  {detail.userStatus?.status === 'attempt' &&
                    t('climbing.attempts_count', { count: detail.attempts })}
                  {!detail.userStatus?.status && t('climbing.status_not_tried')}
                  {detail.userStatus?.isProject &&
                    ` · 🎯 ${t('climbing.status_project')}`}
                </Typography>
              </Section>
            )}
          </Stack>
        </Screen>
      </FormReadonlyProvider>
    </FormProvider>
  );
};

export default ClimbDetailScreen;
