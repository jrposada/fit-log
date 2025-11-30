import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { locationsPutRequestSchema } from '@shared/models/location';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import { useLocationsPut } from '@shared-react/api/locations/use-locations-put';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { z } from 'zod';

import FormLocationPicker from '../library/form/form-location-picker';
import FormTextArea from '../library/form/form-text-area';
import FormTextInput from '../library/form/form-text-input';
import SectorImagePicker from '../library/sector-image-picker';
import { ClimbingParamList } from '../types/climbing';

type CreateLocationNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'CreateLocation'
>;

type CreateLocationRouteProp = RouteProp<ClimbingParamList, 'CreateLocation'>;

type FormData = z.infer<typeof locationsPutRequestSchema>;

const CreateLocationScreen: FunctionComponent = () => {
  const navigation = useNavigation<CreateLocationNavigationProp>();
  const route = useRoute<CreateLocationRouteProp>();

  const locationId = route.params?.locationId;
  const isEditMode = !!locationId;
  const initializedRef = useRef(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(locationsPutRequestSchema),
    defaultValues: {
      name: route.params?.initialName ?? '',
      sectors: [],
    },
  });
  const {
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = methods;
  const sectors = useWatch({ control: methods.control, name: 'sectors' }) || [];

  const [showSectorPicker, setShowSectorPicker] = useState(false);

  const { data: existingLocation, isLoading: isLoadingLocation } =
    useLocationsById({
      id: locationId || '',
    });

  const locationsPut = useLocationsPut({
    onSuccess: (data) => {
      navigation.navigate('ClimbingMain', { newLocationId: data.id });
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to create location: ${error}`);
    },
  });

  const onSubmit = (data: FormData) => {
    const newLocationData = {
      ...data,
      id: isEditMode ? locationId : undefined,
    };

    locationsPut.mutate(newLocationData);
  };

  const handleCancel = () => {
    if (isDirty) {
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

  // Pre-fill form when editing existing location (only once)
  useEffect(() => {
    if (existingLocation && isEditMode && !initializedRef.current) {
      reset({
        id: existingLocation.id,
        name: existingLocation.name,
        description: existingLocation.description,
        latitude: existingLocation.latitude,
        longitude: existingLocation.longitude,
        googleMapsId: existingLocation.googleMapsId,
        sectors: existingLocation.sectors,
      });
      initializedRef.current = true;
    }
  }, [existingLocation, isEditMode, reset]);

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <FormTextInput
              name="name"
              label="Location Name"
              placeholder="Enter location name"
              maxLength={100}
              required
              showCharacterCount
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <FormTextArea
              name="description"
              label="Description (optional)"
              placeholder="Add a description..."
              maxLength={500}
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <FormLocationPicker />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📸 Sectors & Walls (optional)
            </Text>
            <Text style={styles.sectionDescription}>
              Add photos of different areas to reference later
            </Text>
            {sectors.length > 0 && (
              <View style={styles.sectorsList}>
                {sectors.map((sector, index) => (
                  <View key={sector.id || index} style={styles.sectorItem}>
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
            onSave={() => {
              // TODO: Handle sector creation - sectors in API are just string IDs
              // For now, just close the picker
              setShowSectorPicker(false);
            }}
            onCancel={() => setShowSectorPicker(false)}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveButton,
              (!isValid || isLoadingLocation) && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || locationsPut.isPending || isLoadingLocation}
          >
            <Text style={styles.saveButtonText}>
              {isLoadingLocation
                ? 'Loading...'
                : locationsPut.isPending
                  ? 'Saving...'
                  : isEditMode
                    ? 'Update Location'
                    : 'Save Location'}
            </Text>
          </Pressable>
          <Pressable onPress={handleCancel}>
            <Text style={styles.headerButton}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
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
