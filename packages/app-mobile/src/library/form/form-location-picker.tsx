import { FunctionComponent, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import MapPicker from '../../library/map-picker';

const FormLocationPicker: FunctionComponent = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });
  const [showMapPicker, setShowMapPicker] = useState(false);

  const hasLocation = latitude !== undefined && longitude !== undefined;

  return (
    <>
      <Text style={styles.sectionTitle}>
        📍 {t('climbing.location_optional')}
      </Text>
      {hasLocation ? (
        <View style={styles.locationCard}>
          <View style={styles.locationCardContent}>
            <Text style={styles.locationAddress}>
              📍 {t('climbing.location_set')}
            </Text>
            <Text style={styles.locationCoords}>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
          <Pressable onPress={() => setShowMapPicker(true)}>
            <Text style={styles.changeButton}>
              {t('climbing.location_change')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.mapPlaceholder}
          onPress={() => setShowMapPicker(true)}
        >
          <Text style={styles.mapPlaceholderIcon}>📍</Text>
          <Text style={styles.mapPlaceholderText}>
            {t('climbing.location_tap_to_set')}
          </Text>
        </Pressable>
      )}

      <MapPicker
        visible={showMapPicker}
        initialLocation={hasLocation ? { latitude, longitude } : undefined}
        onConfirm={(data) => {
          setValue('latitude', data.latitude, { shouldDirty: true });
          setValue('longitude', data.longitude, { shouldDirty: true });
          if (data.placeId) {
            setValue('googleMapsId', data.placeId, { shouldDirty: true });
          }
          setShowMapPicker(false);
        }}
        onCancel={() => setShowMapPicker(false)}
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
  mapPlaceholder: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  mapPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  locationCardContent: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: '#999',
  },
  changeButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default FormLocationPicker;
