import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SectorsPutRequest } from '@shared/models/sector';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import { useLocationsPut } from '@shared-react/api/locations/use-locations-put';
import { useSectorsBatchDelete } from '@shared-react/api/sectors/use-sectors-batch-delete';
import { useSectorsPut } from '@shared-react/api/sectors/use-sectors-put';
import { FunctionComponent, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

import FormLocationPicker from '../../library/form/form-location-picker';
import FormSectorsManager from '../../library/form/form-sectors-manager';
import FormTextArea from '../../library/form/form-text-area';
import FormTextInput from '../../library/form/form-text-input';
import { ClimbingParamList } from '../../types/climbing';

type CreateLocationNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'CreateLocation'
>;

type CreateLocationRouteProp = RouteProp<ClimbingParamList, 'CreateLocation'>;

export interface SectorWithChanges extends SectorsPutRequest {
  _status?: 'new' | 'updated' | 'deleted';
  _tempId?: string;
}

// Extended form data to include sector objects with tracking info
interface FormDataInternal {
  id?: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  googleMapsId?: string;
  sectors: SectorWithChanges[];
}

const CreateLocationScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CreateLocationNavigationProp>();
  const route = useRoute<CreateLocationRouteProp>();

  const locationId = route.params?.locationId;
  const isEditMode = !!locationId;
  const initializedRef = useRef(false);

  const methods = useForm<FormDataInternal>({
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

  const { data: existingLocation, isLoading: isLoadingLocation } =
    useLocationsById({
      id: locationId || '',
    });

  const locationsPut = useLocationsPut({
    onSuccess: (data) => {
      navigation.navigate('ClimbingMain', { newLocationId: data.id });
    },
    onError: (error) => {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_create_location', { error })
      );
    },
  });
  const sectorsPut = useSectorsPut({
    onError: (error) => {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_save_sectors', { error })
      );
    },
  });
  const sectorsBatchDelete = useSectorsBatchDelete({
    onError: (error) => {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_delete_sectors', { error })
      );
    },
  });

  const onSubmit = async (data: FormDataInternal) => {
    // Process sectors: delete, then create/update
    const sectorsToDelete = data.sectors.filter(
      (s) => s._status === 'deleted' && s.id
    );
    const sectorsToSave = data.sectors.filter((s) => s._status !== 'deleted');

    try {
      // Batch delete sectors that were marked for deletion
      if (sectorsToDelete.length > 0) {
        const idsToDelete = sectorsToDelete
          .map((s) => s.id)
          .filter((id): id is string => !!id);

        if (idsToDelete.length > 0) {
          await sectorsBatchDelete.mutateAsync({ ids: idsToDelete });
        }
      }

      // Save new/updated sectors
      const savedSectorIds: string[] = [];
      for (const sector of sectorsToSave) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _status, _tempId, ...sectorData } = sector;

        await sectorsPut.mutateAsync(sectorData);
        if (sector.id) {
          savedSectorIds.push(sector.id);
        }
      }

      // Build the final location data with sector IDs
      const locationData = {
        id: isEditMode ? locationId : undefined,
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        googleMapsId: data.googleMapsId,
        sectors: savedSectorIds,
      };

      locationsPut.mutate(locationData);
    } catch (error) {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_process_sectors', { error })
      );
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        t('climbing.unsaved_changes'),
        t('climbing.discard_changes_message'),
        [
          { text: t('climbing.cancel'), style: 'cancel' },
          {
            text: t('climbing.discard'),
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
      // For now, just initialize with empty sectors array
      // TODO: Load actual sector data if needed for editing
      reset({
        id: existingLocation.id,
        name: existingLocation.name,
        description: existingLocation.description,
        latitude: existingLocation.latitude,
        longitude: existingLocation.longitude,
        googleMapsId: existingLocation.googleMapsId,
        sectors: [],
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
              label={t('climbing.location_name')}
              placeholder={t('climbing.enter_location_name')}
              maxLength={100}
              required
              showCharacterCount
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <FormTextArea
              name="description"
              label={t('climbing.description_optional')}
              placeholder={t('climbing.add_description')}
              maxLength={500}
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <FormLocationPicker />
          </View>

          <View style={styles.section}>
            <FormSectorsManager />
          </View>
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
                ? t('climbing.loading')
                : locationsPut.isPending
                  ? t('climbing.saving')
                  : isEditMode
                    ? t('climbing.update_location')
                    : t('climbing.save_location')}
            </Text>
          </Pressable>
          <Pressable onPress={handleCancel}>
            <Text style={styles.headerButton}>{t('climbing.cancel')}</Text>
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
