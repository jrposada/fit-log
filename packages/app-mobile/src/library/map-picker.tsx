import { FunctionComponent, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  placeId?: string;
}

interface MapPickerProps {
  visible: boolean;
  initialLocation?: LocationData;
  onConfirm: (location: LocationData) => void;
  onCancel: () => void;
}

const MapPicker: FunctionComponent<MapPickerProps> = ({
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerPlaceholder: {
    width: 60,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  myLocationIcon: {
    fontSize: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MapPicker;
