import { SectorsPutRequest } from '@shared/models/sector';
import { useImagesPost } from '@shared-react/api/images/use-images-post';
import { FunctionComponent, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import FormTextArea from '../../library/form/form-text-area';
import FormTextInput from '../../library/form/form-text-input';
import ImagePicker, { ImagePickerProps } from '../../library/image-picker';
import { FormData } from './form-location';

type SectorWithChanges = SectorsPutRequest & {
  _status?: 'new' | 'updated' | 'deleted';
  _tempId?: string;
};

const FormLocationSectors: FunctionComponent = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<FormData>();
  const sectors = useWatch({ control, name: 'sectors' }) || [];

  const [showSectorPicker, setShowSectorPicker] = useState(false);
  const [editingSectorIndex, setEditingSectorIndex] = useState<number | null>(
    null
  );
  const tempIdCounter = useRef(0);

  const imagePost = useImagesPost();

  const handleAddSector = () => {
    const updatedSectors = [...sectors];

    tempIdCounter.current += 1;
    const newSector: SectorWithChanges = {
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
    setEditingSectorIndex(updatedSectors.length - 1);
    setShowSectorPicker(true);
  };

  const handleEditSector = (index: number) => {
    setEditingSectorIndex(index);
    setShowSectorPicker(true);
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
    setEditingSectorIndex(null);
    setShowSectorPicker(false);
  };

  const handleImagePick: ImagePickerProps['onImageSelected'] = async (
    imageData
  ) => {
    if (editingSectorIndex === null) {
      return;
    }

    try {
      const savedImage = await imagePost.mutateAsync({
        base64: imageData.base64,
        mimeType: imageData.mimeType,
      });

      const updatedSectors = [...sectors];
      const existingSector = updatedSectors[editingSectorIndex];
      existingSector.images = [...existingSector.images, savedImage.id];

      setValue('sectors', updatedSectors, { shouldDirty: true });
      setShowSectorPicker(false);

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
  };

  return (
    <>
      <Text style={styles.sectionTitle}>
        {t('climbing.sectors_walls_optional')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('climbing.sectors_description')}
      </Text>

      {sectors.length > 0 && (
        <View style={styles.sectorsList}>
          {sectors.map((sector: SectorWithChanges, index: number) => {
            const actualIndex = sectors.indexOf(sector);
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
                      label={t('climbing.description_optional')}
                      placeholder={t('climbing.add_description')}
                      maxLength={500}
                      numberOfLines={4}
                    />
                  </View>
                </View>
                <View style={styles.sectorActions}>
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
                      style={[styles.actionButtonText, styles.deleteButtonText]}
                    >
                      {t('climbing.delete')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <Pressable style={styles.addSectorButton} onPress={handleAddSector}>
        <Text style={styles.addSectorButtonText}>
          {sectors.length > 0
            ? t('climbing.add_another_sector')
            : t('climbing.add_first_sector')}
        </Text>
      </Pressable>

      <ImagePicker
        visible={showSectorPicker}
        onImageSelected={handleImagePick}
        onCancel={() => {
          setShowSectorPicker(false);
          setEditingSectorIndex(null);
        }}
        title={'Add Image'}
      />

      {imagePost.isPending && (
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

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addSectorButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addSectorButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  sectorsList: {
    marginBottom: 12,
  },
  sectorItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  sectorMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectorTextContainer: {
    flex: 1,
  },
  sectorDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#fff',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#000',
  },
});

export default FormLocationSectors;
