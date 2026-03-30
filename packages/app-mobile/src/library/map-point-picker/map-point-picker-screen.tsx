import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../../navigation/header';
import Button from '../button';
import { spacing } from '../theme';
import { MapPointPickerEvents } from './map-point-picker-events';
import { styles } from './map-point-picker-screen.styles';

type MapPointPickerParams = {
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
};

type Props = NativeStackScreenProps<MapPointPickerParams, 'MapPointPicker'>;

const MapPointPickerScreen: FunctionComponent<Props> = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const initialLatitude = route.params?.latitude ?? 32.7157;
  const initialLongitude = route.params?.longitude ?? -117.1611;

  const [region, setRegion] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t('climbing.set_location')}
          mode="modal"
          back
          onBackPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, t]);

  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleMyLocation = async () => {
    try {
      Alert.alert(
        'Coming Soon',
        'Current location detection will be available soon'
      );
    } catch {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } catch (error: unknown) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      Alert.alert('Coming Soon', 'Address search will be available soon');
    } catch {
      Alert.alert('Error', 'Search failed');
    }
  };

  const handleConfirm = () => {
    MapPointPickerEvents.emit({
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      address,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('climbing.search_address')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={markerCoordinate}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarkerCoordinate({ latitude, longitude });
              reverseGeocode(latitude, longitude);
            }}
          />
        </MapView>

        <Pressable style={styles.myLocationButton} onPress={handleMyLocation}>
          <Text style={styles.myLocationIcon}>🎯</Text>
        </Pressable>
      </View>

      <View
        style={[styles.footer, { paddingBottom: spacing.lg + insets.bottom }]}
      >
        <View style={styles.addressCard}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.addressText}>
            {address || t('climbing.drop_pin_on_map')}
          </Text>
        </View>
        <Button
          variant="primary"
          title={t('climbing.confirm_pin')}
          onPress={handleConfirm}
          disabled={!address}
        />
      </View>
    </View>
  );
};

export default MapPointPickerScreen;
