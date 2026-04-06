import { useNavigation } from '@react-navigation/native';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import FormTextArea from '../../../../library/form/form-text-area';
import FormTextInput from '../../../../library/form/form-text-input';
import { useFormReadonly } from '../../../../library/form/use-form-readonly';
import IconButton from '../../../../library/icon-button/icon-button';
import { ImageGalleryModal } from '../../../../library/image-gallery-modal';
import { ImagePickerEvents } from '../../../../library/image-picker';
import { spacing } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';
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
  const imageTempIdCounter = useRef(0);

  const [galleryState, setGalleryState] = useState<{
    visible: boolean;
    sectorIndex: number;
    imageIndex: number;
  }>({ visible: false, sectorIndex: 0, imageIndex: 0 });

  const handleOpenGallery = useCallback(
    (sectorIndex: number, imageIndex: number) => {
      setGalleryState({ visible: true, sectorIndex, imageIndex });
    },
    []
  );

  const handleCloseGallery = useCallback(() => {
    setGalleryState((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleDeleteImage = useCallback(
    (sectorIndex: number, imageIndex: number) => {
      const currentSectors = [...allSectors];
      const sector = { ...currentSectors[sectorIndex] };
      const image = sector.images[imageIndex];

      if (image._status === 'new') {
        // New image not yet uploaded — just remove it
        sector.images = sector.images.filter((_, i) => i !== imageIndex);
      } else {
        // Existing image — soft-delete
        sector.images = sector.images.map((img, i) =>
          i === imageIndex ? { ...img, _status: 'deleted' as const } : img
        );
      }

      currentSectors[sectorIndex] = sector;
      setValue('sectors', currentSectors, { shouldDirty: true });
    },
    [allSectors, setValue]
  );

  const handleRestoreImage = useCallback(
    (sectorIndex: number, imageIndex: number) => {
      const currentSectors = [...allSectors];
      const sector = { ...currentSectors[sectorIndex] };
      sector.images = sector.images.map((img, i) =>
        i === imageIndex ? { ...img, _status: undefined } : img
      );
      currentSectors[sectorIndex] = sector;
      setValue('sectors', currentSectors, { shouldDirty: true });
    },
    [allSectors, setValue]
  );

  // Subscribe to image picker results — store locally, upload deferred to submit
  useEffect(() => {
    const unsubscribe = ImagePickerEvents.subscribe((imageData) => {
      if (editingSectorIndexRef.current === null) return;

      imageTempIdCounter.current += 1;
      const pendingImage: FormData['sectors'][number]['images'][number] = {
        _status: 'new',
        _tempId: `img-temp-${imageTempIdCounter.current}`,
        base64: imageData.base64,
        mimeType: imageData.mimeType,
        uri: imageData.uri,
        imageWidth: imageData.width,
        imageHeight: imageData.height,
      };

      const currentSectors = [...allSectors];
      const existingSector = currentSectors[editingSectorIndexRef.current];
      existingSector.images = [...existingSector.images, pendingImage];

      setValue('sectors', currentSectors, { shouldDirty: true });
    });
    return unsubscribe;
  }, [allSectors, setValue]);

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

  const handleRestoreSector = (index: number) => {
    const updatedSectors = [...sectors];
    updatedSectors[index] = {
      ...updatedSectors[index],
      _status: 'updated' as const,
    };
    setValue('sectors', updatedSectors, { shouldDirty: true });
  };

  if (isReadonly && sectors.length === 0) {
    return null;
  }

  return (
    <>
      <Typography weight="medium" style={{ marginBottom: spacing.sm }}>
        📸{' '}
        {isReadonly
          ? t('climbing.sectors')
          : t('climbing.sectors_walls_optional')}
      </Typography>
      {!isReadonly && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Typography
            size="callout"
            color="secondary"
            style={{ marginBottom: spacing.md }}
          >
            {t('climbing.sectors_description')}
          </Typography>
        </Animated.View>
      )}

      {sectors.length > 0 && (
        <View style={styles.sectorsList}>
          {sectors.map((sector, index) => {
            const actualIndex = allSectors.indexOf(sector);
            const isSectorDeleted = sector._status === 'deleted';
            const visibleImages = isReadonly
              ? sector.images?.filter((img) => img._status !== 'deleted')
              : sector.images;
            return (
              <View key={sector.id || sector._tempId || index}>
                <View
                  style={[
                    styles.sectorItem,
                    isSectorDeleted && styles.sectorItemDeleted,
                  ]}
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
                        readonly={isSectorDeleted || undefined}
                      />
                      <FormTextArea
                        name={`sectors.${actualIndex}.description`}
                        label={t('climbing.description')}
                        placeholder={t('climbing.add_description')}
                        maxLength={500}
                        numberOfLines={4}
                        readonly={isSectorDeleted || undefined}
                      />
                    </View>
                  </View>
                  {((visibleImages && visibleImages.length > 0) ||
                    (!isReadonly && !isSectorDeleted)) && (
                    <View style={styles.imagesContainer}>
                      <Typography
                        size="callout"
                        weight="medium"
                        style={{ marginBottom: spacing.sm }}
                      >
                        {t('climbing.images')}
                      </Typography>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imagesScroll}
                        contentContainerStyle={
                          !isReadonly ? styles.imagesScrollContent : undefined
                        }
                      >
                        {visibleImages?.map((image, imgIndex) => {
                          const isImageDeleted = image._status === 'deleted';
                          const isImageNew = image._status === 'new';
                          const imageSource = isImageNew
                            ? image.uri
                            : image.thumbnailUrl;
                          return (
                            <View
                              key={image.id || image._tempId}
                              style={[
                                styles.imageWrapper,
                                isImageDeleted && styles.imageDeleted,
                              ]}
                            >
                              {!isReadonly && !isSectorDeleted && (
                                <IconButton
                                  icon={isImageDeleted ? '↩' : '✕'}
                                  size="xs"
                                  variant={
                                    isImageDeleted ? 'default' : 'destructive'
                                  }
                                  style={styles.deleteImageButton}
                                  onPress={() =>
                                    isImageDeleted
                                      ? handleRestoreImage(
                                          actualIndex,
                                          imgIndex
                                        )
                                      : handleDeleteImage(actualIndex, imgIndex)
                                  }
                                />
                              )}
                              <Pressable
                                disabled={isSectorDeleted}
                                onPress={() =>
                                  handleOpenGallery(actualIndex, imgIndex)
                                }
                              >
                                <Image
                                  source={{ uri: imageSource }}
                                  style={styles.thumbnailImage}
                                  resizeMode="cover"
                                />
                              </Pressable>
                            </View>
                          );
                        })}
                        {!isReadonly && !isSectorDeleted && (
                          <Pressable
                            style={styles.addImageTile}
                            onPress={() => handleEditSector(actualIndex)}
                          >
                            <Typography size="display" color="secondary">
                              +
                            </Typography>
                          </Pressable>
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {!isReadonly && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    style={styles.sectorActions}
                  >
                    {isSectorDeleted ? (
                      <Pressable
                        style={[styles.actionButton, styles.restoreButton]}
                        onPress={() => handleRestoreSector(actualIndex)}
                      >
                        <Typography
                          size="callout"
                          color="inverse"
                          weight="medium"
                        >
                          {t('climbing.restore')}
                        </Typography>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteSector(actualIndex)}
                      >
                        <Typography
                          size="callout"
                          color="inverse"
                          weight="medium"
                        >
                          {t('climbing.delete')}
                        </Typography>
                      </Pressable>
                    )}
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
            <Typography color="accent" weight="medium">
              {sectors.length > 0
                ? t('climbing.add_another_sector')
                : t('climbing.add_first_sector')}
            </Typography>
          </Pressable>
        </Animated.View>
      )}

      {galleryState.visible && (
        <ImageGalleryModal
          visible={galleryState.visible}
          images={
            allSectors[galleryState.sectorIndex]?.images
              ?.filter((img) => img._status !== 'deleted')
              .map((img) => ({
                id: img.id || img._tempId || '',
                imageUrl:
                  img._status === 'new'
                    ? (img.uri ?? '')
                    : (img.imageUrl ?? ''),
              })) ?? []
          }
          initialIndex={galleryState.imageIndex}
          onClose={handleCloseGallery}
        />
      )}
    </>
  );
};

export default FormLocationSectors;
