import { FunctionComponent, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import MapPointPicker from '../../library/map-point-picker';
import FormField from './form-field';
import { styles } from './form-map-point-picker.styles';

interface FormMapPointPickerProps {
  latitudeName: string;
  longitudeName: string;
  googleMapsIdName: string;
  label?: string;
}

const FormMapPointPicker: FunctionComponent<FormMapPointPickerProps> = ({
  latitudeName,
  longitudeName,
  googleMapsIdName,
  label,
}) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  const latitude = useWatch({ control, name: latitudeName });
  const longitude = useWatch({ control, name: longitudeName });

  const [showMapPicker, setShowMapPicker] = useState(false);

  const hasLocation = latitude !== undefined && longitude !== undefined;

  return (
    <FormField label={label}>
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

      <MapPointPicker
        visible={showMapPicker}
        initialLocation={hasLocation ? { latitude, longitude } : undefined}
        onConfirm={(data) => {
          setValue(latitudeName, data.latitude, { shouldDirty: true });
          setValue(longitudeName, data.longitude, { shouldDirty: true });
          if (data.placeId) {
            setValue(googleMapsIdName, data.placeId, { shouldDirty: true });
          }
          setShowMapPicker(false);
        }}
        onCancel={() => setShowMapPicker(false)}
      />
    </FormField>
  );
};

export default FormMapPointPicker;
