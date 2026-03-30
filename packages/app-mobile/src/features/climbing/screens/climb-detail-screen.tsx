import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClimbGrade } from '@shared/models/climb/climb';
import { Hold } from '@shared/models/climb/climb';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { useClimbsPut } from '@shared-react/api/climbs/use-climbs-put';
import { useImagesPost } from '@shared-react/api/images/use-images-post';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  LayoutChangeEvent,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import { FormReadonlyProvider } from '../../../library/form/form-readonly-context';
import FormTextArea from '../../../library/form/form-text-area';
import FormTextInput from '../../../library/form/form-text-input';
import IconButton from '../../../library/icon-button';
import ImagePicker, { ImagePickerResult } from '../../../library/image-picker';
import LoadingState from '../../../library/loading-state';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import Select from '../../../library/select';
import { colors } from '../../../library/theme';
import UnsavedBanner from '../../../library/unsaved-banner';
import Header from '../../../navigation/header';
import ClimbImage from '../components/climb-image';
import GradeBadge from '../components/grade-badge';
import { ClimbingParamList } from '../types';

type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

const GRADE_OPTIONS: ClimbGrade[] = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];

const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

const formSchema = z.object({
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),
  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

type FormData = z.infer<typeof formSchema>;

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbDetailNavigationProp>();
  const route = useRoute<ClimbDetailRouteProp>();

  const climbId = route.params?.climbId;
  const locationId = route.params?.locationId;
  const isCreateMode = !climbId;

  const [isEditMode, setIsEditMode] = useState(isCreateMode);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | undefined>(
    undefined
  );
  const initializedRef = useRef(false);

  const handleScrollLayout = (event: LayoutChangeEvent) => {
    setScrollHeight(event.nativeEvent.layout.height);
  };

  // Data fetching
  const { data: climb, isLoading: isLoadingClimb } = useClimbsById({
    id: climbId || '',
  });
  const { data: location, isLoading: isLoadingLocation } = useLocationsById({
    id: (isCreateMode ? locationId : climb?.location?.id) || '',
  });

  const sectors = useMemo(() => location?.sectors ?? [], [location]);

  // Form setup
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      grade: '',
      description: '',
      holds: [],
      image: '',
      location: locationId || '',
      sector: '',
    },
  });
  const {
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
    setValue,
    control,
  } = methods;

  const watchedHolds = useWatch({ control, name: 'holds' });
  const watchedGrade = useWatch({ control, name: 'grade' });
  const watchedImage = useWatch({ control, name: 'image' });
  const watchedSector = useWatch({ control, name: 'sector' });

  // Derive image URI: uploaded image takes precedence, then existing climb image
  const imageUri =
    uploadedImageUri ??
    (watchedImage && climb?.image?.id === watchedImage
      ? climb.image.imageUrl
      : undefined);

  // Pre-fill form when editing existing climb
  useEffect(() => {
    if (climb && !isCreateMode && !initializedRef.current) {
      reset({
        name: climb.name,
        grade: climb.grade,
        description: climb.description ?? '',
        holds: climb.holds,
        image: climb.image.id,
        location: climb.location.id,
        sector: climb.sector.id,
      });
      initializedRef.current = true;
    }
  }, [climb, isCreateMode, reset]);

  // Mutations
  const climbsPut = useClimbsPut({
    onSuccess: () => {
      if (isCreateMode) {
        Alert.alert(
          t('climbing.climb_created_title'),
          t('climbing.climb_created_message'),
          [{ text: t('actions.ok'), onPress: () => navigation.goBack() }]
        );
      } else {
        setIsEditMode(false);
        initializedRef.current = false;
        Alert.alert(
          t('climbing.climb_updated_title'),
          t('climbing.climb_updated_message')
        );
      }
    },
    onError: (error) => {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_save_climb', { error })
      );
    },
  });

  const deleteClimb = useClimbsDelete({
    onSuccess: () => {
      Alert.alert(
        t('climbing.climb_deleted_title'),
        t('climbing.climb_deleted_message'),
        [{ text: t('actions.ok'), onPress: () => navigation.goBack() }]
      );
    },
    onError: (error) => {
      Alert.alert(t('climbing.error'), error);
    },
  });

  const imagesPost = useImagesPost({
    onError: (error) => {
      Alert.alert(
        t('climbing.error'),
        t('climbing.failed_upload_image', { error })
      );
    },
  });

  // Handlers
  const onSubmit = (data: FormData) => {
    climbsPut.mutate({
      id: isCreateMode ? undefined : climbId,
      name: data.name,
      grade: data.grade,
      description: data.description || undefined,
      holds: data.holds,
      image: data.image,
      location: data.location,
      sector: data.sector,
    });
  };

  const handleHoldAdd = useCallback(
    (hold: Hold) => {
      setValue('holds', [...watchedHolds, hold], { shouldDirty: true });
    },
    [watchedHolds, setValue]
  );

  const handleHoldRemove = useCallback(
    (index: number) => {
      setValue(
        'holds',
        watchedHolds.filter((_, i) => i !== index),
        { shouldDirty: true }
      );
    },
    [watchedHolds, setValue]
  );

  const handleDelete = () => {
    if (!climbId) return;
    Alert.alert(
      t('climbing.delete_climb_title'),
      t('climbing.delete_climb_message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.delete'),
          style: 'destructive',
          onPress: () => deleteClimb.mutate({ id: climbId }),
        },
      ]
    );
  };

  const handleEnterEditMode = useCallback(() => {
    if (climb) {
      reset({
        name: climb.name,
        grade: climb.grade,
        description: climb.description ?? '',
        holds: climb.holds,
        image: climb.image.id,
        location: climb.location.id,
        sector: climb.sector.id,
      });
    }
    setIsEditMode(true);
  }, [climb, reset]);

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

  const handleOpenMap = useCallback(() => {
    if (!climb?.location?.latitude || !climb?.location?.longitude) return;
    const { latitude, longitude } = climb.location;
    const label = encodeURIComponent(climb.location.name || 'Location');
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${label}@${latitude},${longitude}`
        : `geo:0,0?q=${latitude},${longitude}(${label})`;
    Linking.openURL(url);
  }, [climb]);

  const handleImageSelected = async (imageData: ImagePickerResult) => {
    setImagePickerVisible(false);
    try {
      const savedImage = await imagesPost.mutateAsync({
        base64: imageData.base64,
        mimeType: imageData.mimeType,
      });
      setUploadedImageUri(savedImage.imageUrl);
      setValue('image', savedImage.id, { shouldDirty: true });
    } catch {
      // Error handled by imagesPost onError
    }
  };

  const handleSectorChange = (sectorName: string) => {
    const sector = sectors.find((s) => s.name === sectorName);
    if (sector) {
      setValue('sector', sector.id, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleGradeSelect = (grade: string) => {
    setValue('grade', grade, { shouldDirty: true, shouldValidate: true });
  };

  // Header control
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !isDirty,
      header: () => (
        <Header
          title={isCreateMode ? t('climbing.create_climb_title') : climb?.name}
          extra={
            !isCreateMode && climb ? (
              <GradeBadge grade={climb.grade} />
            ) : undefined
          }
          action={
            !isCreateMode ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <IconButton icon="📍" onPress={handleOpenMap} />
                <IconButton
                  icon="✏️"
                  onPress={isEditMode ? handleCancelEdit : handleEnterEditMode}
                  style={
                    isEditMode
                      ? {
                          backgroundColor: colors.actionPrimary,
                          borderRadius: 8,
                        }
                      : undefined
                  }
                />
              </View>
            ) : undefined
          }
          loading={isLoadingClimb}
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
    climb,
    isLoadingClimb,
    t,
    handleBackPress,
    handleCancelEdit,
    handleEnterEditMode,
    handleOpenMap,
  ]);

  // Loading state for detail mode
  if (!isCreateMode && isLoadingClimb) {
    return (
      <LoadingState
        isLoading
        style={{ backgroundColor: colors.screenBackground }}
      />
    );
  }

  if (!isCreateMode && !climb) {
    return <EmptyState message={t('climbing.climb_not_found')} />;
  }

  const selectedSector = sectors.find((s) => s.id === watchedSector);
  const isSubmitDisabled =
    !isValid || !isDirty || climbsPut.isPending || imagesPost.isPending;

  const footer = (() => {
    if (!isEditMode) {
      return undefined;
    }
    if (isCreateMode) {
      return (
        <Button
          variant="primary"
          title={
            climbsPut.isPending
              ? t('climbing.saving')
              : t('climbing.create_climb_title')
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
              climbsPut.isPending ? t('climbing.saving') : t('actions.save')
            }
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitDisabled}
            style={{ flex: 1 }}
          />
        </View>
        <Button
          variant="destructive"
          title={
            deleteClimb.isPending
              ? t('climbing.deleting')
              : t('climbing.delete_climb_button')
          }
          onPress={handleDelete}
          disabled={deleteClimb.isPending}
        />
      </View>
    );
  })();

  return (
    <FormProvider {...methods}>
      <FormReadonlyProvider readonly={!isEditMode}>
        <Screen
          keyboardAvoiding={isEditMode}
          scrollViewProps={{
            ...(isEditMode && { keyboardShouldPersistTaps: 'handled' }),
            onLayout: handleScrollLayout,
          }}
          footer={footer}
        >
          {isEditMode && (
            <UnsavedBanner
              isDirty={isDirty}
              message={t('climbing.unsaved_changes_banner')}
            />
          )}

          {/* Create-only fields: sector, name, grade, image picker */}
          {isCreateMode && (
            <>
              <Section spacing="lg">
                <LoadingState isLoading={isLoadingLocation}>
                  <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                    {t('climbing.sector')}
                  </Text>
                  <Select
                    options={sectors.map((s) => s.name)}
                    value={selectedSector?.name || ''}
                    onChange={handleSectorChange}
                    placeholder={t('climbing.select_sector')}
                    searchPlaceholder={t('climbing.search_sector')}
                    closeButtonLabel={t('actions.close')}
                    emptyStateMessage={t('climbing.no_sectors_found')}
                  />
                </LoadingState>
              </Section>

              <Section spacing="lg">
                <FormTextInput
                  name="name"
                  label={t('climbing.climb_name')}
                  placeholder={t('climbing.enter_climb_name')}
                  maxLength={100}
                  required
                  showCharacterCount
                />
              </Section>

              <Section spacing="lg">
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                  {t('climbing.grade')}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      onPress={() => handleGradeSelect(grade)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                        backgroundColor:
                          watchedGrade === grade
                            ? colors.actionPrimary
                            : colors.cardBackground,
                        borderWidth: 1,
                        borderColor:
                          watchedGrade === grade
                            ? colors.actionPrimary
                            : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            watchedGrade === grade
                              ? colors.cardBackground
                              : colors.textPrimary,
                          fontWeight: watchedGrade === grade ? '600' : '400',
                        }}
                      >
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Section>

              <Section spacing="lg">
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                  {t('climbing.select_image')}
                </Text>
                {watchedImage && imageUri ? (
                  <View>
                    <ClimbImage
                      source={{ uri: imageUri }}
                      holds={watchedHolds}
                      style={{ height: scrollHeight * 0.6 }}
                      editable
                      onHoldAdd={handleHoldAdd}
                      onHoldRemove={handleHoldRemove}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        marginTop: 8,
                        color: colors.textSecondary,
                        fontSize: 13,
                      }}
                    >
                      {t('climbing.mark_holds_hint')}
                    </Text>
                  </View>
                ) : (
                  <Button
                    variant="primary"
                    title={
                      imagesPost.isPending
                        ? t('climbing.uploading_image')
                        : t('climbing.select_image')
                    }
                    onPress={() => setImagePickerVisible(true)}
                    disabled={imagesPost.isPending}
                  />
                )}
              </Section>
            </>
          )}

          {/* Existing climb: image */}
          {!isCreateMode && watchedImage && imageUri && (
            <View>
              <ClimbImage
                source={{ uri: imageUri }}
                holds={watchedHolds}
                style={{
                  height: isEditMode ? scrollHeight * 0.6 : scrollHeight,
                }}
                editable={isEditMode}
                onHoldAdd={handleHoldAdd}
                onHoldRemove={handleHoldRemove}
              />
              {isEditMode && (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 8,
                    color: colors.textSecondary,
                    fontSize: 13,
                  }}
                >
                  {t('climbing.mark_holds_hint')}
                </Text>
              )}
            </View>
          )}

          {/* Existing climb: name */}
          {!isCreateMode && (
            <Section spacing="lg">
              <FormTextInput
                name="name"
                label={t('climbing.climb_name')}
                placeholder={t('climbing.enter_climb_name')}
                maxLength={100}
                required
                showCharacterCount
              />
            </Section>
          )}

          {/* Shared: description */}
          <Section spacing="lg">
            <FormTextArea
              name="description"
              label={t('climbing.description')}
              placeholder={t('climbing.add_description')}
              maxLength={500}
              numberOfLines={4}
            />
          </Section>

          {isEditMode && (
            <ImagePicker
              visible={imagePickerVisible}
              onImageSelected={handleImageSelected}
              onCancel={() => setImagePickerVisible(false)}
              title={t('climbing.select_image')}
            />
          )}
        </Screen>
      </FormReadonlyProvider>
    </FormProvider>
  );
};

export default ClimbDetailScreen;
export type { ClimbDetailRouteProp };
