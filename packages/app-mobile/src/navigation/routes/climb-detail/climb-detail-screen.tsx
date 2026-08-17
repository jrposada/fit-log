import { zodResolver } from '@hookform/resolvers/zod';
import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import { HoldType } from '@jrposada/fit-log-shared/common/climbs/holds';
import {
  canDelete,
  canEdit,
} from '@jrposada/fit-log-shared/models/auth/with-ownership';
import {
  Climb,
  Hold,
  SplinePoint,
} from '@jrposada/fit-log-shared/models/climbs/climb';
import { climbsPutRequestSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-put';
import { useClimbHistories } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories';
import { useClimbHistoriesPut } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbHistoryProject } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-history-project';
import { useClimbsById } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-delete';
import { useClimbsPut } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-put';
import { useImagesPost } from '@jrposada/fit-log-shared-react/api/images/use-images-post';
import { useLocationsById } from '@jrposada/fit-log-shared-react/api/locations/use-locations-by-id';
import { useMe } from '@jrposada/fit-log-shared-react/api/me/use-me';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import z from 'zod';

import ClimbImage from '../../../features/climbing/components/climb-detail/climb-image';
import { Selection } from '../../../features/climbing/components/climb-detail/climb-image/climb-image';
import ClimbImageEditCard from '../../../features/climbing/components/climb-detail/climb-image/climb-image-edit-card';
import GradeBadge from '../../../features/climbing/components/common/grade-badge';
import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import { FormReadonlyProvider } from '../../../library/form/form-readonly-context';
import FormTextArea from '../../../library/form/form-text-area';
import FormTextInput from '../../../library/form/form-text-input';
import IconButton from '../../../library/icon-button';
import { ImagePickerEvents } from '../../../library/image-picker';
import LoadingState from '../../../library/loading-state';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import Select from '../../../library/select';
import Stack from '../../../library/stack';
import { surfaces } from '../../../library/theme';
import { useToast } from '../../../library/toast';
import { Typography } from '../../../library/typography';
import { RootStackParamList } from '../../../types/routes';
import Header from '../../common/header';

export type ClimbDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ClimbDetail'
>;

export type ClimbDetailRouteProp = RouteProp<RootStackParamList, 'ClimbDetail'>;

type FormData = z.infer<typeof climbsPutRequestSchema>;

type ClimbDetailHeaderProps = {
  isCreateMode: boolean;
  isEditMode: boolean;
  isDirty: boolean;
  isLoadingClimb: boolean;
  climb: Climb | undefined;
  canEdit: boolean;
  onBackPress: () => void;
  onCancelEdit: () => void;
  onEnterEditMode: () => void;
  onOpenMap: () => void;
};

const ClimbDetailHeader: FunctionComponent<ClimbDetailHeaderProps> = ({
  isCreateMode,
  isEditMode,
  isDirty,
  isLoadingClimb,
  climb,
  canEdit,
  onBackPress,
  onCancelEdit,
  onEnterEditMode,
  onOpenMap,
}) => {
  const { t } = useTranslation();

  return (
    <Header
      title={isCreateMode ? t('climbing.create_climb_title') : climb?.name}
      subtitle={
        !isCreateMode &&
        climb &&
        `${climb.location.name} · ${climb.sector.name}`
      }
      extra={!isCreateMode && climb && <GradeBadge grade={climb.grade} />}
      action={
        !isCreateMode && (
          <Stack direction="horizontal" gap="sm">
            <IconButton icon="location-on" onPress={onOpenMap} />
            {canEdit && (
              <IconButton
                icon={isEditMode && isDirty ? 'warning' : 'edit'}
                variant={isEditMode ? 'primary' : 'default'}
                onPress={isEditMode ? onCancelEdit : onEnterEditMode}
              />
            )}
          </Stack>
        )
      }
      loading={isLoadingClimb}
      mode="modal"
      back
      onBackPress={onBackPress}
    />
  );
};

type ClimbDetailFooterProps = {
  isCreateMode: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isHistoryPending: boolean;
  isProject: boolean;
  isProjectPending: boolean;
  isCompleted: boolean;
  canDelete: boolean;
  selection: Selection;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  handleLogSend: () => void;
  onToggleProject: () => void;
  onSelectionMove: (dx: number, dy: number) => void;
  onSelectionResize: (scaleFactor: number) => void;
};

const ClimbDetailFooter: FunctionComponent<ClimbDetailFooterProps> = ({
  isCreateMode,
  isEditMode,
  isSubmitDisabled,
  isSaving,
  isDeleting,
  isHistoryPending,
  isProject,
  isProjectPending,
  isCompleted,
  canDelete,
  selection,
  onSubmit,
  onCancel,
  onDelete,
  handleLogSend,
  onToggleProject: handleToggleProject,
  onSelectionMove: handleSelectionMove,
  onSelectionResize: handleSelectionResize,
}) => {
  const { t } = useTranslation();

  if (isCreateMode) {
    return (
      <Button
        variant="primary"
        title={
          isSaving ? t('climbing.saving') : t('climbing.create_climb_title')
        }
        onPress={onSubmit}
        disabled={isSubmitDisabled}
      />
    );
  }

  if (selection) {
    return (
      <ClimbImageEditCard
        selectionType={selection.type}
        onMove={handleSelectionMove}
        onResize={selection?.type === 'hold' && handleSelectionResize}
      />
    );
  }

  if (isEditMode) {
    return (
      <Stack direction="horizontal" gap="md">
        {canDelete && (
          <IconButton
            variant="destructive"
            icon="delete"
            size="lg"
            onPress={onDelete}
            disabled={isDeleting}
          />
        )}
        <Button
          fullWidth
          variant="outline"
          title={t('actions.cancel')}
          onPress={onCancel}
        />
        <Button
          fullWidth
          variant="primary"
          title={isSaving ? t('climbing.saving') : t('actions.save')}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
        />
      </Stack>
    );
  }

  if (!isCompleted) {
    return (
      <Section variant="transparent" direction="horizontal" gap="md">
        <Button
          fullWidth
          variant="primary"
          title={`✓ ${t('climbing.browse_log_send')}`}
          onPress={handleLogSend}
          disabled={isHistoryPending}
        />
        <Button
          fullWidth
          variant="outline"
          title={
            isProject
              ? t('climbing.unproject_action')
              : `+ ${t('climbing.project_action')}`
          }
          onPress={handleToggleProject}
          disabled={isProjectPending}
        />
      </Section>
    );
  }

  return null;
};

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigation = useNavigation<ClimbDetailNavigationProp>();
  const route = useRoute<ClimbDetailRouteProp>();

  const climbId = route.params?.climbId;
  const locationId = route.params?.locationId;
  const isCreateMode = !climbId;

  const [isEditMode, setIsEditMode] = useState(isCreateMode);
  const [selection, setSelection] = useState<Selection>(null);

  const [scrollHeight, setScrollHeight] = useState(0);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | undefined>(
    undefined
  );
  const initializedRef = useRef(false);

  const handleScrollLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollHeight((prev) => (prev === 0 ? height : prev));
  };

  const { data: me } = useMe();
  const { data: climb, isLoading: isLoadingClimb } = useClimbsById({
    id: climbId,
  });

  const canEditClimb = !!me && !!climb && canEdit(me, climb);
  const canDeleteClimb = !!me && !!climb && canDelete(me, climb);
  const { data: location, isLoading: isLoadingLocation } = useLocationsById({
    id: isCreateMode ? locationId : climb?.location?.id,
  });

  const { items: climbHistories } = useClimbHistories({
    climbId: climbId || '',
    limit: 1,
  });
  const userStatus = climbHistories[0];

  const climbHistoriesPut = useClimbHistoriesPut();
  const climbHistoryProject = useClimbHistoryProject();

  const sectors = useMemo(() => location?.sectors ?? [], [location]);

  const methods = useForm<FormData>({
    resolver: zodResolver(climbsPutRequestSchema),
    defaultValues: {
      name: '',
      grade: '',
      description: '',
      holds: [],
      spline: [],
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
  const watchedSpline = useWatch({ control, name: 'spline' });
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
        spline: climb.spline ?? [],
        image: climb.image?.id ?? '',
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
        toast.show(t('climbing.climb_created_message'), 'success');
        navigation.goBack();
      } else {
        setIsEditMode(false);
        initializedRef.current = false;
        toast.show(t('climbing.climb_updated_message'), 'success');
      }
    },
    onError: (error) => {
      toast.show(t('climbing.failed_save_climb', { error }), 'destructive');
    },
  });

  const deleteClimb = useClimbsDelete({
    onSuccess: () => {
      toast.show(t('climbing.climb_deleted_message'), 'success');
      navigation.goBack();
    },
    onError: (error) => {
      toast.show(error, 'destructive');
    },
  });

  const imagesPost = useImagesPost({
    onError: (error) => {
      toast.show(t('climbing.failed_upload_image', { error }), 'destructive');
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
      spline: data.spline,
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

  const handleSplinePointAdd = useCallback(
    (point: SplinePoint) => {
      setValue('spline', [...watchedSpline, point], { shouldDirty: true });
    },
    [watchedSpline, setValue]
  );

  const handleSplinePointInsert = useCallback(
    (afterIndex: number, point: SplinePoint) => {
      const next = [...watchedSpline];
      next.splice(afterIndex + 1, 0, point);
      setValue('spline', next, { shouldDirty: true });
    },
    [watchedSpline, setValue]
  );

  const handleSplinePointRemove = useCallback(
    (index: number) => {
      setValue(
        'spline',
        watchedSpline.filter((_, i) => i !== index),
        { shouldDirty: true }
      );
    },
    [watchedSpline, setValue]
  );

  const handleHoldTypeChange = useCallback(
    (index: number, type: HoldType) => {
      setValue(
        'holds',
        watchedHolds.map((h, i) => (i === index ? { ...h, type } : h)),
        { shouldDirty: true }
      );
    },
    [watchedHolds, setValue]
  );

  const handleHoldResize = useCallback(
    (index: number, radius: number) => {
      setValue(
        'holds',
        watchedHolds.map((h, i) => (i === index ? { ...h, radius } : h)),
        { shouldDirty: true }
      );
    },
    [watchedHolds, setValue]
  );

  const handleHoldMove = useCallback(
    (index: number, dx: number, dy: number) => {
      const hold = watchedHolds[index];
      if (!hold) return;
      setValue(
        'holds',
        watchedHolds.map((h, i) =>
          i === index
            ? {
                ...h,
                x: Math.max(0, Math.min(1, h.x + dx)),
                y: Math.max(0, Math.min(1, h.y + dy)),
              }
            : h
        ),
        { shouldDirty: true }
      );
    },
    [watchedHolds, setValue]
  );

  const handleSplinePointMove = useCallback(
    (index: number, dx: number, dy: number) => {
      const point = watchedSpline[index];
      if (!point) return;
      setValue(
        'spline',
        watchedSpline.map((p, i) =>
          i === index
            ? {
                ...p,
                x: Math.max(0, Math.min(1, p.x + dx)),
                y: Math.max(0, Math.min(1, p.y + dy)),
              }
            : p
        ),
        { shouldDirty: true }
      );
    },
    [watchedSpline, setValue]
  );

  const RADIUS_MIN = 0.01;
  const RADIUS_MAX = 0.15;

  const handleSelectionMove = useCallback(
    (dx: number, dy: number) => {
      if (!selection) return;
      if (selection.type === 'hold') {
        handleHoldMove(selection.index, dx, dy);
      } else {
        handleSplinePointMove(selection.index, dx, dy);
      }
    },
    [selection, handleHoldMove, handleSplinePointMove]
  );

  const handleSelectionResize = useCallback(
    (scaleFactor: number) => {
      if (!selection || selection.type !== 'hold') return;
      const hold = watchedHolds[selection.index];
      if (!hold) return;
      const newRadius = Math.min(
        RADIUS_MAX,
        Math.max(RADIUS_MIN, hold.radius * scaleFactor)
      );
      handleHoldResize(selection.index, newRadius);
    },
    [selection, watchedHolds, handleHoldResize]
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
        spline: climb.spline ?? [],
        image: climb.image?.id ?? '',
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
              setSelection(null);
              setIsEditMode(false);
            },
          },
        ]
      );
    } else {
      setSelection(null);
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

  // Subscribe to image picker results
  useEffect(() => {
    const unsubscribe = ImagePickerEvents.subscribe(async (imageData) => {
      try {
        const savedImage = await imagesPost.mutateAsync({
          base64: imageData.base64,
          mimeType: imageData.mimeType,
        });
        setUploadedImageUri(savedImage.imageUrl);
        setValue('image', savedImage.id, { shouldDirty: true });
        setValue('holds', [], { shouldDirty: true });
        setValue('spline', [], { shouldDirty: true });
        setSelection(null);
      } catch {
        // Error handled by imagesPost onError
      }
    });
    return unsubscribe;
  }, [imagesPost, setValue]);

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

  const handleSelectImage = () => {
    navigation.navigate('ImagePicker' as never);
  };

  const handleChangeImage = useCallback(() => {
    const hasAnnotations = watchedHolds.length > 0 || watchedSpline.length > 0;
    if (!hasAnnotations) {
      navigation.navigate('ImagePicker' as never);
      return;
    }
    Alert.alert(
      t('climbing.change_image_title'),
      t('climbing.change_image_message'),
      [
        { text: t('climbing.cancel'), style: 'cancel' },
        {
          text: t('climbing.discard'),
          style: 'destructive',
          onPress: () => navigation.navigate('ImagePicker' as never),
        },
      ]
    );
  }, [watchedHolds, watchedSpline, navigation, t]);

  const handleLogSend = async () => {
    // const trainingSession = await ensureActiveClimbingSession();
    // climbHistoriesPut.mutate({
    //   climb: climbId!,
    //   location: climb!.location.id,
    //   sector: climb!.sector.id,
    //   status: 'send',
    //   attempts: 1,
    //   trainingSession,
    // });
  };

  const handleToggleProject = () => {
    climbHistoryProject.mutate({
      climb: climbId!,
      location: climb!.location.id,
      sector: climb!.sector.id,
      isProject: !userStatus?.isProject,
    });
  };

  // Header control
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !isDirty,
      header: () => (
        <ClimbDetailHeader
          isCreateMode={isCreateMode}
          isEditMode={isEditMode}
          isDirty={isDirty}
          isLoadingClimb={isLoadingClimb}
          climb={climb}
          canEdit={canEditClimb}
          onBackPress={handleBackPress}
          onCancelEdit={handleCancelEdit}
          onEnterEditMode={handleEnterEditMode}
          onOpenMap={handleOpenMap}
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
    canEditClimb,
    handleBackPress,
    handleCancelEdit,
    handleEnterEditMode,
    handleOpenMap,
  ]);

  const selectedSector = sectors.find((s) => s.id === watchedSector);
  const isSubmitDisabled =
    !isValid || !isDirty || climbsPut.isPending || imagesPost.isPending;
  const isCompleted =
    userStatus?.status === 'flash' || userStatus?.status === 'send';
  const attempts =
    userStatus?.tries.reduce((sum, tr) => sum + (tr.attempts || 0), 0) ?? 0;

  if (!isCreateMode && isLoadingClimb) {
    return (
      <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
    );
  }

  if (!isCreateMode && !climb) {
    return <EmptyState message={t('climbing.climb_not_found')} />;
  }

  return (
    <FormProvider {...methods}>
      <FormReadonlyProvider readonly={!isEditMode}>
        <Screen
          presentation="modal"
          footerVariant={isEditMode && selection ? 'transparent' : 'default'}
          keyboardAvoiding={isEditMode}
          onContentLayout={handleScrollLayout}
          footer={
            <ClimbDetailFooter
              isCreateMode={isCreateMode}
              isEditMode={isEditMode}
              isSubmitDisabled={isSubmitDisabled}
              isSaving={climbsPut.isPending}
              isDeleting={deleteClimb.isPending}
              isHistoryPending={climbHistoriesPut.isPending}
              isProject={userStatus?.isProject || false}
              isProjectPending={climbHistoryProject.isPending}
              isCompleted={isCompleted}
              canDelete={canDeleteClimb}
              selection={selection}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelEdit}
              onDelete={handleDelete}
              handleLogSend={handleLogSend}
              onToggleProject={handleToggleProject}
              onSelectionMove={handleSelectionMove}
              onSelectionResize={handleSelectionResize}
            />
          }
        >
          {watchedImage && imageUri ? (
            <Animated.View layout={LinearTransition}>
              <ClimbImage
                source={{ uri: imageUri }}
                holds={watchedHolds}
                spline={watchedSpline}
                selection={selection}
                onSelectionChange={setSelection}
                style={{
                  height: scrollHeight,
                }}
                editable={isEditMode}
                onHoldAdd={handleHoldAdd}
                onHoldRemove={handleHoldRemove}
                onHoldTypeChange={handleHoldTypeChange}
                onSplinePointAdd={handleSplinePointAdd}
                onSplinePointInsert={handleSplinePointInsert}
                onSplinePointRemove={handleSplinePointRemove}
                onChangeImage={isCreateMode ? handleChangeImage : undefined}
                isImageUploading={imagesPost.isPending}
              />
            </Animated.View>
          ) : (
            <Section title={t('climbing.select_image')}>
              <Button
                variant="primary"
                title={
                  imagesPost.isPending
                    ? t('climbing.uploading_image')
                    : t('climbing.select_image')
                }
                onPress={handleSelectImage}
                disabled={imagesPost.isPending}
              />
            </Section>
          )}

          <Stack padding="lg" gap="lg">
            <Section>
              <FormTextInput
                name="name"
                label={t('climbing.climb_name')}
                placeholder={t('climbing.enter_climb_name')}
                maxLength={100}
                required
                showCharacterCount
              />
            </Section>

            <Section>
              <FormTextArea
                name="description"
                label={t('climbing.description')}
                placeholder={t('climbing.add_description')}
                maxLength={500}
                numberOfLines={4}
              />
            </Section>

            {isEditMode && (
              <Section title={t('climbing.grade')}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <GradeBadge
                      key={grade}
                      grade={grade}
                      variant={watchedGrade === grade ? 'filled' : 'ghost'}
                      onPress={() => handleGradeSelect(grade)}
                    />
                  ))}
                </ScrollView>
              </Section>
            )}

            {isCreateMode && (
              <Section title={t('climbing.sector')}>
                <LoadingState isLoading={isLoadingLocation}>
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
            )}

            {!isCreateMode && !isEditMode && (
              <Section title={t('climbing.browse_your_status')}>
                <Typography size="callout" color="secondary">
                  {userStatus?.status === 'flash' &&
                    `✓ ${t('climbing.status_flash')}`}
                  {userStatus?.status === 'send' &&
                    `✓ ${t('climbing.status_sent')}: ${t('climbing.attempts_count', { count: attempts })}`}
                  {userStatus?.status === 'attempt' &&
                    t('climbing.attempts_count', { count: attempts })}
                  {!userStatus?.status && t('climbing.status_not_tried')}
                  {userStatus?.isProject &&
                    ` · 🎯 ${t('climbing.status_project')}`}
                </Typography>
              </Section>
            )}
          </Stack>
        </Screen>
      </FormReadonlyProvider>
    </FormProvider>
  );
};

export default ClimbDetailScreen;
