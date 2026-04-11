import { Hold } from '@shared/models/climb/climb';
import { Location } from '@shared/models/location/location';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import Button from '../../../../library/button';
import FormTextInput from '../../../../library/form/form-text-input';
import LoadingState from '../../../../library/loading-state';
import Section from '../../../../library/section';
import Select from '../../../../library/select';
import { accent, borders, surfaces } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';
import ClimbImage from '../../components/climb-detail/climb-image';
import { GRADE_OPTIONS } from './climb-detail-screen.types';

type ClimbDetailCreateFieldsProps = {
  sectors: Location['sectors'];
  isLoadingLocation: boolean;
  selectedSector: Location['sectors'][number] | undefined;
  scrollHeight: number;
  imageUri: string | undefined;
  watchedImage: string;
  watchedGrade: string;
  watchedHolds: Hold[];
  isImageUploading: boolean;
  onSectorChange: (sectorName: string) => void;
  onGradeSelect: (grade: string) => void;
  onHoldAdd: (hold: Hold) => void;
  onHoldRemove: (index: number) => void;
  onSelectImage: () => void;
};

const ClimbDetailCreateFields: FunctionComponent<
  ClimbDetailCreateFieldsProps
> = ({
  sectors,
  isLoadingLocation,
  selectedSector,
  scrollHeight,
  imageUri,
  watchedImage,
  watchedGrade,
  watchedHolds,
  isImageUploading,
  onSectorChange,
  onGradeSelect,
  onHoldAdd,
  onHoldRemove,
  onSelectImage,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Section spacing="lg">
        <LoadingState isLoading={isLoadingLocation}>
          <Typography weight="semibold" style={{ marginBottom: 8 }}>
            {t('climbing.sector')}
          </Typography>
          <Select
            options={sectors.map((s) => s.name)}
            value={selectedSector?.name || ''}
            onChange={onSectorChange}
            placeholder={t('climbing.select_sector')}
            searchPlaceholder={t('climbing.search_sector')}
            closeButtonLabel={t('actions.close')}
            emptyStateMessage={t('climbing.no_sectors_found')}
          />
        </LoadingState>
      </Section>

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
        <Typography weight="semibold" style={{ marginBottom: 8 }}>
          {t('climbing.grade')}
        </Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {GRADE_OPTIONS.map((grade) => (
            <TouchableOpacity
              key={grade}
              onPress={() => onGradeSelect(grade)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor:
                  watchedGrade === grade ? accent.primary : surfaces.base,
                borderWidth: 1,
                borderColor:
                  watchedGrade === grade ? accent.primary : borders.subtle,
              }}
            >
              <Typography
                color={watchedGrade === grade ? 'inverse' : 'primary'}
                weight={watchedGrade === grade ? 'semibold' : 'regular'}
              >
                {grade}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Section>

      <Section spacing="lg">
        <Typography weight="semibold" style={{ marginBottom: 8 }}>
          {t('climbing.select_image')}
        </Typography>
        {watchedImage && imageUri ? (
          <View>
            <ClimbImage
              source={{ uri: imageUri }}
              holds={watchedHolds}
              style={{ height: scrollHeight * 0.6 }}
              editable
              onHoldAdd={onHoldAdd}
              onHoldRemove={onHoldRemove}
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
              isImageUploading
                ? t('climbing.uploading_image')
                : t('climbing.select_image')
            }
            onPress={onSelectImage}
            disabled={isImageUploading}
          />
        )}
      </Section>
    </>
  );
};

export default ClimbDetailCreateFields;
