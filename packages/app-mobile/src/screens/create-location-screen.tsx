import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import { useLocationsPut } from '@shared-react/api/locations/use-locations-put';
import { useSectorsBatchDelete } from '@shared-react/api/sectors/use-sectors-batch-delete';
import { useSectorsBatchPut } from '@shared-react/api/sectors/use-sectors-batch-put';
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

import type { FormData } from '../features/climbing/form-location';
import { formDataSchema } from '../features/climbing/form-location';
import FormLocationSectors from '../features/climbing/form-location-sectors';
import FormMapPointPicker from '../library/form/form-map-point-picker';
import FormTextArea from '../library/form/form-text-area';
import FormTextInput from '../library/form/form-text-input';
import { ClimbingParamList } from '../types/climbing';

type CreateLocationNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'CreateLocation'
>;

type CreateLocationRouteProp = RouteProp<ClimbingParamList, 'CreateLocation'>;

const CreateLocationScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CreateLocationNavigationProp>();
  const route = useRoute<CreateLocationRouteProp>();

  const locationId = route.params?.locationId;
  const isEditMode = !!locationId;
  const initializedRef = useRef(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
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
  const sectorsBatchPut = useSectorsBatchPut({
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

  const onSubmit = async (data: FormData) => {
    const sectorsWithUpdatedStatus = data.sectors.map((sector, index) => {
      const sectorDirtyFields = methods.formState.dirtyFields.sectors?.[index];

      if (
        sector.id &&
        sector._status !== 'new' &&
        sector._status !== 'deleted' &&
        Object.keys(sectorDirtyFields ?? {}).length > 0
      ) {
        return { ...sector, _status: 'updated' as const };
      }

      return sector;
    });

    const sectorsToDelete = sectorsWithUpdatedStatus.filter(
      (s): s is typeof s & { _status: 'deleted'; id: string } =>
        s._status === 'deleted' && !!s.id
    );
    const sectorsToSave = sectorsWithUpdatedStatus.filter(
      (s): s is typeof s & { _status: 'new' | 'updated' } =>
        s._status === 'new' || s._status === 'updated'
    );
    const sectorsId = new Set(
      sectorsWithUpdatedStatus
        .filter(
          (s): s is typeof s & { id: string } =>
            s._status !== 'deleted' && !!s.id
        )
        .map((s) => s.id)
    );

    try {
      if (sectorsToDelete.length > 0) {
        const idsToDelete = sectorsToDelete
          .map((s) => s.id)
          .filter((id): id is string => !!id);

        if (idsToDelete.length > 0) {
          await sectorsBatchDelete.mutateAsync({ ids: idsToDelete });
        }
      }

      if (sectorsToSave.length > 0) {
        const sectorsData = sectorsToSave.map((sector) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _status, _tempId, ...sectorData } = sector;
          return sectorData;
        });

        const result = await sectorsBatchPut.mutateAsync({
          sectors: sectorsData.map((sector) => ({
            ...sector,
            climbs: sector.climbs,
            images: sector.images.map((image) => image.id),
          })),
        });
        result.sectors.forEach((s) => sectorsId.add(s.id));
      }

      const locationData = {
        id: isEditMode ? locationId : undefined,
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        googleMapsId: data.googleMapsId,
        sectors: [...sectorsId],
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

  const isSubmitDisabled =
    !isValid || !isDirty || locationsPut.isPending || isLoadingLocation;

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

          <View style={styles.section}></View>
          <FormMapPointPicker
            latitudeName="latitude"
            longitudeName="longitude"
            googleMapsIdName="googleMapsId"
          />

          <View style={styles.section}>
            <FormLocationSectors />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveButton,
              isSubmitDisabled && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitDisabled}
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
