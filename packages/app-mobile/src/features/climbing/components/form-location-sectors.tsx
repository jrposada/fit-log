import { useNavigation } from '@react-navigation/native';
import { useImagesPost } from '@shared-react/api/images/use-images-post';
import { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import FormTextArea from '../../../library/form/form-text-area';
import FormTextInput from '../../../library/form/form-text-input';
import { useFormReadonly } from '../../../library/form/use-form-readonly';
import { ImagePickerEvents } from '../../../library/image-picker';
import { FormData } from './form-location';
import { styles } from './form-location-sectors.styles';

const FormLocationSectors: FunctionComponent = () => {
  const { t } = useTranslation();
  const isReadonly = useFormReadonly();
  const navigation = useNavigation();
  const { control, setValue } = useFormContext<FormData>();
  const watchedSectors = useWatch({ control, name: 'sectors' });
  const allSectors = useMemo(() => watchedSectors || [], [watchedSectors]);
  const sectors = isReadonly
    ? allSectors.filter((s) => s._status !== 'deleted')
    : allSectors;

  const editingSectorIndexRef = useRef<number | null>(null);
  const tempIdCounter = useRef(0);

  const imagePost = useImagesPost();

  // Subscribe to image picker results
  useEffect(() => {
    const unsubscribe = ImagePickerEvents.subscribe(async (imageData) => {
      if (editingSectorIndexRef.current === null) return;

      try {
        const savedImage = await imagePost.mutateAsync({
          base64: imageData.base64,
          mimeType: imageData.mimeType,
        });

        const currentSectors = [...allSectors];
        const existingSector = currentSectors[editingSectorIndexRef.current];
        existingSector.images = [...existingSector.images, savedImage];

        setValue('sectors', currentSectors, { shouldDirty: true });

        Alert.alert(
          t('climbing.success'),
          t('climbing.image_uploaded_successfully')
        );
      } catch (error) {
        console.error('Failed to upload image:', error);
        Alert.alert(
          t('climbing.error'),
          t('climbing.failed_upload_image', {
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        );
      }
    });
    return unsubscribe;
  }, [allSectors, imagePost, setValue, t]);

  const handleAddSector = () => {
    const updatedSectors = [...sectors];

    tempIdCounter.current += 1;
    const newSector: FormData['sectors'][number] = {
      isPrimary: false,
      name: '',
      latitude: 0,
      longitude: 0,
      images: [],
      climbs: [],
      _tempId: `temp-${tempIdCounter.current}`,
      _status: 'new',
    };

    updatedSectors.push(newSector);

    setValue('sectors', updatedSectors, { shouldDirty: true });
    editingSectorIndexRef.current = updatedSectors.length - 1;
    navigation.navigate('ImagePicker' as never);
  };

  const handleEditSector = (index: number) => {
    editingSectorIndexRef.current = index;
    navigation.navigate('ImagePicker' as never);
  };

  const handleDeleteSector = (index: number) => {
    const updatedSectors = [...sectors];
    const sector = updatedSectors[index];

    if (sector.id) {
      updatedSectors[index] = {
        ...sector,
        _status: 'deleted' as const,
      };
    } else {
      updatedSectors.splice(index, 1);
    }

    setValue('sectors', updatedSectors, { shouldDirty: true });
    editingSectorIndexRef.current = null;
  };

  if (isReadonly && sectors.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionTitle}>
        {isReadonly
          ? t('climbing.sectors')
          : t('climbing.sectors_walls_optional')}
      </Text>
      {!isReadonly && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Text style={styles.sectionDescription}>
            {t('climbing.sectors_description')}
          </Text>
        </Animated.View>
      )}

      {sectors.length > 0 && (
        <View style={styles.sectorsList}>
          {sectors.map((sector, index) => {
            const actualIndex = allSectors.indexOf(sector);
            return (
              <View
                key={sector.id || sector._tempId || index}
                style={styles.sectorItem}
              >
                <View style={styles.sectorMainContent}>
                  <View style={styles.sectorTextContainer}>
                    <FormTextInput
                      name={`sectors.${actualIndex}.name`}
                      label={t('climbing.sector_name')}
                      placeholder={t('climbing.enter_sector_name')}
                      maxLength={100}
                      required
                      showCharacterCount
                    />
                    <FormTextArea
                      name={`sectors.${actualIndex}.description`}
                      label={t('climbing.description')}
                      placeholder={t('climbing.add_description')}
                      maxLength={500}
                      numberOfLines={4}
                    />
                  </View>
                </View>
                {sector.images && sector.images.length > 0 && (
                  <View style={styles.imagesContainer}>
                    <Text style={styles.imagesLabel}>
                      {t('climbing.images')}
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.imagesScroll}
                    >
                      {sector.images.map((image) => (
                        <View key={image.id} style={styles.imageWrapper}>
                          <Image
                            source={{
                              uri: image.thumbnailUrl,
                            }}
                            style={styles.thumbnailImage}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {!isReadonly && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    style={styles.sectorActions}
                  >
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleEditSector(actualIndex)}
                    >
                      <Text style={styles.actionButtonText}>
                        {t('climbing.edit')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteSector(actualIndex)}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.deleteButtonText,
                        ]}
                      >
                        {t('climbing.delete')}
                      </Text>
                    </Pressable>
                  </Animated.View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {!isReadonly && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Pressable style={styles.addSectorButton} onPress={handleAddSector}>
            <Text style={styles.addSectorButtonText}>
              {sectors.length > 0
                ? t('climbing.add_another_sector')
                : t('climbing.add_first_sector')}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {!isReadonly && imagePost.isPending && (
        <View style={styles.uploadingOverlay}>
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.uploadingText}>
              {t('climbing.uploading_image')}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default FormLocationSectors;
