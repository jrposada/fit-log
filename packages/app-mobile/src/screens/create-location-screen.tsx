import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LocationsPutRequest } from '@shared/models/location';
import { useLocationsPut } from '@shared-react/api/locations/use-locations-put';
import { FunctionComponent, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import MapPicker from '../library/map-picker';
import SectorImagePicker from '../library/sector-image-picker';
import { ClimbingParamList } from '../types/climbing';

type CreateLocationNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'CreateLocation'
>;

type CreateLocationRouteProp = RouteProp<ClimbingParamList, 'CreateLocation'>;
interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  placeId?: string;
}

interface SectorData {
  name: string;
  description?: string;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  imageFileSize: number;
}

const CreateLocationScreen: FunctionComponent = () => {
  const navigation = useNavigation<CreateLocationNavigationProp>();
  const route = useRoute<CreateLocationRouteProp>();
  const [name, setName] = useState(route.params?.initialName ?? '');
  const [description, setDescription] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showSectorPicker, setShowSectorPicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const locationsPut = useLocationsPut({
    onSuccess: (data) => {
      setHasUnsavedChanges(false);
      navigation.navigate('ClimbingMain', { newLocationId: data.id });
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to create location: ${error}`);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Location name is required');
      return;
    }

    const newLocationData: LocationsPutRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
      address: locationData?.address,
      placeName: locationData?.placeName,
      placeId: locationData?.placeId,
    };

    locationsPut.mutate(newLocationData);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setHasUnsavedChanges(true);
  };

  const isValid = name.trim().length > 0 && name.length <= 100;
  const descriptionLength = description.length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.label}>
            Location Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              !isValid && name.length > 0 && styles.inputError,
            ]}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter location name"
            maxLength={100}
            autoFocus
          />
          <Text style={styles.helperText}>{name.length}/100 characters</Text>
          {!isValid && name.length > 0 && (
            <Text style={styles.errorText}>
              {name.trim().length === 0
                ? 'Location name is required'
                : 'Name cannot exceed 100 characters'}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="Add a description..."
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text
            style={[
              styles.helperText,
              descriptionLength > 500 && styles.errorText,
            ]}
          >
            {descriptionLength}/500 characters
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location (optional)</Text>
          {locationData ? (
            <View style={styles.locationCard}>
              <View style={styles.locationCardContent}>
                <Text style={styles.locationAddress}>
                  📍 {locationData.address || 'Location set'}
                </Text>
                <Text style={styles.locationCoords}>
                  {locationData.latitude.toFixed(4)},{' '}
                  {locationData.longitude.toFixed(4)}
                </Text>
              </View>
              <Pressable onPress={() => setShowMapPicker(true)}>
                <Text style={styles.changeButton}>Change</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.mapPlaceholder}
              onPress={() => setShowMapPicker(true)}
            >
              <Text style={styles.mapPlaceholderIcon}>📍</Text>
              <Text style={styles.mapPlaceholderText}>
                Tap to set pin on map
              </Text>
            </Pressable>
          )}
        </View>

        <MapPicker
          visible={showMapPicker}
          initialLocation={locationData || undefined}
          onConfirm={(data) => {
            setLocationData(data);
            setShowMapPicker(false);
            setHasUnsavedChanges(true);
          }}
          onCancel={() => setShowMapPicker(false)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Sectors & Walls (optional)</Text>
          <Text style={styles.sectionDescription}>
            Add photos of different areas to reference later
          </Text>
          {sectors.length > 0 && (
            <View style={styles.sectorsList}>
              {sectors.map((sector, index) => (
                <View key={index} style={styles.sectorItem}>
                  <Text style={styles.sectorIcon}>📷</Text>
                  <Text style={styles.sectorText}>{sector.name}</Text>
                </View>
              ))}
            </View>
          )}
          <Pressable
            style={styles.addSectorButton}
            onPress={() => setShowSectorPicker(true)}
          >
            <Text style={styles.addSectorButtonText}>
              {sectors.length > 0
                ? '+ Add Another Sector'
                : '+ Add First Sector/Wall'}
            </Text>
          </Pressable>
        </View>

        <SectorImagePicker
          visible={showSectorPicker}
          initialSectorNumber={sectors.length + 1}
          onSave={(sectorData) => {
            setSectors([...sectors, sectorData]);
            setShowSectorPicker(false);
            setHasUnsavedChanges(true);
          }}
          onCancel={() => setShowSectorPicker(false)}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isValid || locationsPut.isPending}
        >
          <Text style={styles.saveButtonText}>
            {locationsPut.isPending ? 'Saving...' : 'Save Location'}
          </Text>
        </Pressable>
        <Pressable onPress={handleCancel}>
          <Text style={styles.headerButton}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerButtonPlaceholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff3b30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    minHeight: 100,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 4,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  sectorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectorText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateLocationScreen;
