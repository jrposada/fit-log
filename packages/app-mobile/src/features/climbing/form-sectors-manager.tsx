import { FunctionComponent, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import SectorImagePicker from './sector-image-picker';

const FormSectorsManager: FunctionComponent = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const sectors = useWatch({ control, name: 'sectors' }) || [];

  const [showSectorPicker, setShowSectorPicker] = useState(false);
  const [editingSectorIndex, setEditingSectorIndex] = useState<number | null>(
    null
  );
  const tempIdCounter = useRef(0);

  const handleAddSector = () => {
    setEditingSectorIndex(null);
    setShowSectorPicker(true);
  };

  const handleEditSector = (index: number) => {
    setEditingSectorIndex(index);
    setShowSectorPicker(true);
  };

  const handleDeleteSector = (index: number) => {
    Alert.alert(
      t('climbing.delete_sector'),
      t('climbing.delete_sector_message'),
      [
        { text: t('climbing.cancel'), style: 'cancel' },
        {
          text: t('climbing.delete'),
          style: 'destructive',
          onPress: () => {
            const updatedSectors = [...sectors];
            const sector = updatedSectors[index];

            // If sector has an ID (existing sector), mark as deleted
            if (sector.id) {
              updatedSectors[index] = {
                ...sector,
                _status: 'deleted' as const,
              };
            } else {
              // If it's a new sector without ID, just remove it
              updatedSectors.splice(index, 1);
            }

            setValue('sectors', updatedSectors, { shouldDirty: true });
          },
        },
      ]
    );
  };

  const handleSaveSector = (sectorData: {
    name: string;
    description?: string;
    imageUri: string;
    imageWidth: number;
    imageHeight: number;
    imageFileSize: number;
  }) => {
    const updatedSectors = [...sectors];

    tempIdCounter.current += 1;
    const newSector: SectorWithChanges = {
      name: sectorData.name,
      description: sectorData.description,
      isPrimary: false,
      latitude: 0, // TODO: Get from form or default location
      longitude: 0, // TODO: Get from form or default location
      images: [], // Will be populated after image upload
      climbs: [],
      _tempId: `temp-${tempIdCounter.current}`,
      _status: editingSectorIndex !== null ? 'updated' : 'new',
    };

    // If editing existing sector, preserve the ID
    if (editingSectorIndex !== null) {
      const existingSector = updatedSectors[editingSectorIndex];
      if (existingSector.id) {
        newSector.id = existingSector.id;
      }
      updatedSectors[editingSectorIndex] = newSector;
    } else {
      updatedSectors.push(newSector);
    }

    setValue('sectors', updatedSectors, { shouldDirty: true });
    setShowSectorPicker(false);
    setEditingSectorIndex(null);
  };

  const visibleSectors = sectors.filter(
    (sector: SectorWithChanges) => sector._status !== 'deleted'
  );

  return (
    <>
      <Text style={styles.sectionTitle}>
        {t('climbing.sectors_walls_optional')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('climbing.sectors_description')}
      </Text>

      {visibleSectors.length > 0 && (
        <View style={styles.sectorsList}>
          {visibleSectors.map((sector: SectorWithChanges, index: number) => {
            const actualIndex = sectors.indexOf(sector);
            return (
              <View
                key={sector.id || sector._tempId || index}
                style={styles.sectorItem}
              >
                <View style={styles.sectorMainContent}>
                  <Text style={styles.sectorIcon}>📷</Text>
                  <View style={styles.sectorTextContainer}>
                    <Text style={styles.sectorText}>{sector.name}</Text>
                    {sector.description && (
                      <Text style={styles.sectorDescription}>
                        {sector.description}
                      </Text>
                    )}
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
          {visibleSectors.length > 0
            ? t('climbing.add_another_sector')
            : t('climbing.add_first_sector')}
        </Text>
      </Pressable>

      <SectorImagePicker
        visible={showSectorPicker}
        initialSectorNumber={visibleSectors.length + 1}
        onSave={handleSaveSector}
        onCancel={() => {
          setShowSectorPicker(false);
          setEditingSectorIndex(null);
        }}
      />
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
  sectorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectorTextContainer: {
    flex: 1,
  },
  sectorText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
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
});

export default FormSectorsManager;
