import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import { MapPointPickerEvents } from '../map-point-picker';
import FormField from './form-field';
import { styles } from './form-map-point-picker.styles';
import { useFormReadonly } from './use-form-readonly';

interface FormMapPointPickerProps {
  latitudeName: string;
  longitudeName: string;
  googleMapsIdName: string;
  label?: string;
  readonly?: boolean;
}

type NavigationProp = NativeStackNavigationProp<{
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
}>;

const FormMapPointPicker: FunctionComponent<FormMapPointPickerProps> = ({
  latitudeName,
  longitudeName,
  googleMapsIdName,
  label,
  readonly,
}) => {
  const { t } = useTranslation();
  const isReadonly = useFormReadonly(readonly);
  const navigation = useNavigation<NavigationProp>();
  const { control, setValue } = useFormContext();

  const latitude = useWatch({ control, name: latitudeName });
  const longitude = useWatch({ control, name: longitudeName });

  const hasLocation = latitude !== undefined && longitude !== undefined;

  const [isOpeningMap, setIsOpeningMap] = useState(false);

  // Subscribe to map picker results
  useEffect(() => {
    const unsubscribe = MapPointPickerEvents.subscribe((result) => {
      setValue(latitudeName, result.latitude, { shouldDirty: true });
      setValue(longitudeName, result.longitude, { shouldDirty: true });
      if (result.placeId) {
        setValue(googleMapsIdName, result.placeId, { shouldDirty: true });
      }
    });
    return unsubscribe;
  }, [latitudeName, longitudeName, googleMapsIdName, setValue]);

  const handleOpenPicker = useCallback(() => {
    navigation.navigate(
      'MapPointPicker',
      hasLocation ? { latitude, longitude } : undefined
    );
  }, [navigation, hasLocation, latitude, longitude]);

  const handleOpenMap = useCallback(() => {
    if (!hasLocation) return;
    setIsOpeningMap(true);
    const locationLabel = encodeURIComponent('Location');
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${locationLabel}@${latitude},${longitude}`
        : `geo:0,0?q=${latitude},${longitude}(${locationLabel})`;
    Linking.openURL(url).finally(() => {
      setTimeout(() => setIsOpeningMap(false), 1000);
    });
  }, [hasLocation, latitude, longitude]);

  if (isReadonly && !hasLocation) {
    return null;
  }

  if (isReadonly && hasLocation) {
    return (
      <FormField label={label} readonly={isReadonly}>
        <Pressable
          onPress={handleOpenMap}
          style={({ pressed }) => [
            styles.mapPreviewContainer,
            pressed && styles.mapPreviewPressed,
          ]}
        >
          <View style={styles.mapPreviewMapContainer}>
            <MapView
              provider={
                Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
              }
              style={styles.mapPreview}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              pointerEvents="none"
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
            {isOpeningMap && (
              <View style={styles.mapPreviewOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.mapPreviewHint}>
            {t('climbing.tap_to_open_map')}
          </Text>
        </Pressable>
      </FormField>
    );
  }

  return (
    <FormField label={label} readonly={isReadonly}>
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
          <Pressable onPress={handleOpenPicker}>
            <Text style={styles.changeButton}>
              {t('climbing.location_change')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.mapPlaceholder} onPress={handleOpenPicker}>
          <Text style={styles.mapPlaceholderIcon}>📍</Text>
          <Text style={styles.mapPlaceholderText}>
            {t('climbing.location_tap_to_set')}
          </Text>
        </Pressable>
      )}
    </FormField>
  );
};

export default FormMapPointPicker;
