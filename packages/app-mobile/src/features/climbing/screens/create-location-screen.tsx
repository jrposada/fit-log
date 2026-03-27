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
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormMapPointPicker from '../../../library/form/form-map-point-picker';
import FormTextArea from '../../../library/form/form-text-area';
import FormTextInput from '../../../library/form/form-text-input';
import type { FormData } from '../components/form-location';
import { formDataSchema } from '../components/form-location';
import FormLocationSectors from '../components/form-location-sectors';
import { ClimbingParamList } from '../types';
import { styles } from './create-location-screen.styles';

type CreateLocationNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'CreateLocation'
>;

type CreateLocationRouteProp = RouteProp<ClimbingParamList, 'CreateLocation'>;

const CreateLocationScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty) return;

      e.preventDefault();

      Alert.alert(
        t('climbing.unsaved_changes'),
        t('climbing.discard_changes_message'),
        [
          { text: t('climbing.cancel'), style: 'cancel' },
          {
            text: t('climbing.discard'),
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isDirty, t]);

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

        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
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
                    : t('climbing.create_location')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default CreateLocationScreen;
