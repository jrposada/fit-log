import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hold, SplinePoint } from '@shared/models/climb/climb';
import { climbsPutRequestSchema } from '@shared/models/climb/climb-put';
import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbHistoryProject } from '@shared-react/api/climb-histories/use-climb-history-project';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { useClimbsPut } from '@shared-react/api/climbs/use-climbs-put';
import { useImagesPost } from '@shared-react/api/images/use-images-post';
import { useLocationsById } from '@shared-react/api/locations/use-locations-by-id';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, LayoutChangeEvent, Linking, Platform } from 'react-native';
import z from 'zod';

import { ImagePickerEvents } from '../../../../library/image-picker';
import { useToast } from '../../../../library/toast';
import { Selection } from '../../components/climb-detail/climb-image/climb-image';
import { ClimbingParamList } from '../../types';
import ClimbDetailHeader from './use-climb-detail-header';

export type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

export type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

type FormData = z.infer<typeof climbsPutRequestSchema>;

const useClimbDetail = () => {
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

  const { data: climb, isLoading: isLoadingClimb } = useClimbsById({
    id: climbId,
  });
  const { data: location, isLoading: isLoadingLocation } = useLocationsById({
    id: isCreateMode ? locationId : climb?.location?.id,
  });

  const { data: climbHistories = [] } = useClimbHistories({
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

  const handleLogSend = () => {
    climbHistoriesPut.mutate({
      climb: climbId!,
      location: climb!.location.id,
      sector: climb!.sector.id,
      status: 'send',
      attempts: 1,
    });
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
    handleBackPress,
    handleCancelEdit,
    handleEnterEditMode,
    handleOpenMap,
  ]);

  const selectedSector = sectors.find((s) => s.id === watchedSector);
  const isSubmitDisabled =
    !isValid || !isDirty || climbsPut.isPending || imagesPost.isPending;

  return {
    // Form
    methods,
    isDirty,
    isValid,
    handleSubmit,

    // Mode flags
    isCreateMode,
    isEditMode,
    isLoadingClimb,
    isLoadingLocation,

    // Data
    climb,
    sectors,
    selectedSector,
    userStatus,
    imageUri,
    scrollHeight,
    isCompleted:
      userStatus?.status === 'flash' || userStatus?.status === 'send',
    attempts:
      userStatus?.tries.reduce((sum, tr) => sum + (tr.attempts || 0), 0) ?? 0,

    // Selection
    selection,
    setSelection,
    hasSelection: selection !== null,
    handleSelectionMove,
    handleSelectionResize,

    // Watched form values
    watchedHolds,
    watchedSpline,
    watchedGrade,
    watchedImage,

    // Submission state
    isSubmitDisabled,
    isClimbSaving: climbsPut.isPending,
    isClimbDeleting: deleteClimb.isPending,
    isImageUploading: imagesPost.isPending,
    isHistoryPending: climbHistoriesPut.isPending,
    isProjectPending: climbHistoryProject.isPending,

    // Handlers
    onSubmit,
    handleHoldAdd,
    handleHoldRemove,
    handleHoldResize,
    handleHoldMove,
    handleSplinePointAdd,
    handleSplinePointRemove,
    handleSplinePointMove,
    handleDelete,
    handleCancelEdit,
    handleScrollLayout,
    handleSectorChange,
    handleGradeSelect,
    handleSelectImage,
    handleLogSend,
    handleToggleProject,
  };
};

export default useClimbDetail;
