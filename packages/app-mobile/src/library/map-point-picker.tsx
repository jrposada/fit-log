import { FunctionComponent, useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { styles } from './map-point-picker.styles';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  placeId?: string;
}

interface MapPointPickerProps {
  visible: boolean;
  initialLocation?: LocationData;
  onConfirm: (location: LocationData) => void;
  onCancel: () => void;
}

const MapPointPicker: FunctionComponent<MapPointPickerProps> = ({
  visible,
  initialLocation,
  onConfirm,
  onCancel,
}) => {
  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude ?? 32.7157,
    longitude: initialLocation?.longitude ?? -117.1611,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: initialLocation?.latitude ?? 32.7157,
    longitude: initialLocation?.longitude ?? -117.1611,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState(initialLocation?.address || '');

  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleMyLocation = async () => {
    try {
      // Request location permission using expo-location
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
      // This would use Google Geocoding API
      // For now, setting a placeholder
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } catch (error: unknown) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // This would use Google Places Autocomplete API
      // For now, showing a coming soon message
      Alert.alert('Coming Soon', 'Address search will be available soon');
    } catch {
      Alert.alert('Error', 'Search failed');
    }
  };

  const handleConfirm = () => {
    onConfirm({
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      address,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onCancel}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Set Location</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search address or place"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
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

        <View style={styles.footer}>
          <View style={styles.addressCard}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText}>
              {address || 'Drop pin on map'}
            </Text>
          </View>
          <Pressable
            style={[
              styles.confirmButton,
              !address && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!address}
          >
            <Text style={styles.confirmButtonText}>Confirm Pin</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MapPointPicker;
