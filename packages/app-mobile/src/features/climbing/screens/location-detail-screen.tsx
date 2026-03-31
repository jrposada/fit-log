import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import { useLocationsDelete } from '@shared-react/api/locations/use-locations-delete';
import { useLocationsPut } from '@shared-react/api/locations/use-locations-put';
import { useSectorsBatchDelete } from '@shared-react/api/sectors/use-sectors-batch-delete';
import { useSectorsBatchPut } from '@shared-react/api/sectors/use-sectors-batch-put';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Platform, View } from 'react-native';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import FormMapPointPicker from '../../../library/form/form-map-point-picker';
import { FormReadonlyProvider } from '../../../library/form/form-readonly-context';
import FormTextArea from '../../../library/form/form-text-area';
import FormTextInput from '../../../library/form/form-text-input';
import IconButton from '../../../library/icon-button';
import LoadingState from '../../../library/loading-state';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import { accent, surfaces } from '../../../library/theme';
import UnsavedBanner from '../../../library/unsaved-banner';
import Header from '../../../navigation/header';
import type { FormData } from '../components/location-detail/form-location';
import { formDataSchema } from '../components/location-detail/form-location';
import FormLocationSectors from '../components/location-detail/form-location-sectors';
import { ClimbingParamList } from '../types';

type LocationDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'LocationDetail'
>;

type LocationDetailRouteProp = RouteProp<ClimbingParamList, 'LocationDetail'>;

const LocationDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LocationDetailNavigationProp>();
  const route = useRoute<LocationDetailRouteProp>();

  const locationId = route.params?.locationId;
  const isCreateMode = !locationId;

  const [isEditMode, setIsEditMode] = useState(isCreateMode);
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
      if (isCreateMode) {
        navigation.navigate('ClimbingMain', { newLocationId: data.id });
      } else {
        setIsEditMode(false);
        initializedRef.current = false;
        Alert.alert(
          t('climbing.location_updated_title'),
          t('climbing.location_updated_message')
        );
      }
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

  const deleteLocation = useLocationsDelete({
    onSuccess: () => {
      Alert.alert(
        t('climbing.location_deleted_title'),
        t('climbing.location_deleted_message'),
        [{ text: t('actions.ok'), onPress: () => navigation.goBack() }]
      );
    },
    onError: (error) => {
      Alert.alert(t('climbing.error'), error);
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
            images: sector.images
              .filter((image) => image._status !== 'deleted')
              .map((image) => image.id),
          })),
        });
        result.sectors.forEach((s) => sectorsId.add(s.id));
      }

      const locationData = {
        id: isCreateMode ? undefined : locationId,
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
    if (existingLocation && !isCreateMode && !initializedRef.current) {
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
  }, [existingLocation, isCreateMode, reset]);

  const handleEnterEditMode = useCallback(() => {
    if (existingLocation) {
      reset({
        id: existingLocation.id,
        name: existingLocation.name,
        description: existingLocation.description,
        latitude: existingLocation.latitude,
        longitude: existingLocation.longitude,
        googleMapsId: existingLocation.googleMapsId,
        sectors: existingLocation.sectors,
      });
    }
    setIsEditMode(true);
  }, [existingLocation, reset]);

  const handleCancelEdit = useCallback(() => {
    if (isDirty) {
      Alert.alert(
        t('climbing.unsaved_changes'),
        t('climbing.discard_changes_message'),
        [
          { text: t('climbing.cancel'), style: 'cancel' },
          {
            text: t('climbing.discard'),
            style: 'destructive',
            onPress: () => {
              reset();
              setIsEditMode(false);
            },
          },
        ]
      );
    } else {
      setIsEditMode(false);
    }
  }, [isDirty, reset, t]);

  const handleBackPress = useCallback(() => {
    if (isEditMode && isDirty) {
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
  }, [navigation, isEditMode, isDirty, t]);

  const handleDelete = () => {
    if (!locationId) return;
    Alert.alert(
      t('climbing.delete_location_title'),
      t('climbing.delete_location_message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.delete'),
          style: 'destructive',
          onPress: () => deleteLocation.mutate({ id: locationId }),
        },
      ]
    );
  };

  const handleOpenMap = useCallback(() => {
    if (!existingLocation?.latitude || !existingLocation?.longitude) return;
    const { latitude, longitude } = existingLocation;
    const label = encodeURIComponent(existingLocation.name || 'Location');
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${label}@${latitude},${longitude}`
        : `geo:0,0?q=${latitude},${longitude}(${label})`;
    Linking.openURL(url);
  }, [existingLocation]);

  // Header
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !isDirty,
      header: () => (
        <Header
          title={
            isCreateMode
              ? t('climbing.create_location_title')
              : existingLocation?.name
          }
          action={
            !isCreateMode ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {existingLocation?.latitude && existingLocation?.longitude && (
                  <IconButton icon="📍" onPress={handleOpenMap} />
                )}
                <IconButton
                  icon="✏️"
                  onPress={isEditMode ? handleCancelEdit : handleEnterEditMode}
                  style={
                    isEditMode
                      ? {
                          backgroundColor: accent.primary,
                          borderRadius: 8,
                        }
                      : undefined
                  }
                />
              </View>
            ) : undefined
          }
          loading={isLoadingLocation}
          mode="modal"
          back
          onBackPress={handleBackPress}
        />
      ),
    });
  }, [
    navigation,
    isCreateMode,
    isEditMode,
    isDirty,
    existingLocation,
    isLoadingLocation,
    t,
    handleBackPress,
    handleCancelEdit,
    handleEnterEditMode,
    handleOpenMap,
  ]);

  // Loading state for detail mode
  if (!isCreateMode && isLoadingLocation) {
    return (
      <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
    );
  }

  if (!isCreateMode && !existingLocation) {
    return <EmptyState message={t('climbing.location_not_found')} />;
  }

  const isSubmitDisabled =
    !isValid || !isDirty || locationsPut.isPending || isLoadingLocation;

  const footer = (() => {
    if (!isEditMode) {
      return undefined;
    }
    if (isCreateMode) {
      return (
        <Button
          variant="primary"
          title={
            isLoadingLocation
              ? t('climbing.loading')
              : locationsPut.isPending
                ? t('climbing.saving')
                : t('climbing.create_location')
          }
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitDisabled}
        />
      );
    }
    return (
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            variant="outline"
            title={t('actions.cancel')}
            onPress={handleCancelEdit}
            style={{ flex: 1 }}
          />
          <Button
            variant="primary"
            title={
              locationsPut.isPending ? t('climbing.saving') : t('actions.save')
            }
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitDisabled}
            style={{ flex: 1 }}
          />
        </View>
        <Button
          variant="destructive"
          title={
            deleteLocation.isPending
              ? t('climbing.deleting')
              : t('climbing.delete_location_button')
          }
          onPress={handleDelete}
          disabled={deleteLocation.isPending}
        />
      </View>
    );
  })();

  return (
    <FormProvider {...methods}>
      <FormReadonlyProvider readonly={!isEditMode}>
        <Screen
          keyboardAvoiding={isEditMode}
          scrollViewProps={
            isEditMode ? { keyboardShouldPersistTaps: 'handled' } : undefined
          }
          footer={footer}
        >
          {isEditMode && (
            <UnsavedBanner
              isDirty={isDirty}
              message={t('climbing.unsaved_changes_banner')}
            />
          )}
          <Section spacing="lg">
            <FormTextInput
              name="name"
              label={t('climbing.location_name')}
              placeholder={t('climbing.enter_location_name')}
              maxLength={100}
              required
              showCharacterCount
              autoFocus={isCreateMode}
            />
          </Section>

          <Section spacing="lg">
            <FormTextArea
              name="description"
              label={t('climbing.description')}
              placeholder={t('climbing.add_description')}
              maxLength={500}
              numberOfLines={4}
            />
          </Section>

          <Section spacing="lg">
            <FormMapPointPicker
              latitudeName="latitude"
              longitudeName="longitude"
              googleMapsIdName="googleMapsId"
              label={t('climbing.location')}
            />
          </Section>

          <Section spacing="lg">
            <FormLocationSectors />
          </Section>
        </Screen>
      </FormReadonlyProvider>
    </FormProvider>
  );
};

export default LocationDetailScreen;
