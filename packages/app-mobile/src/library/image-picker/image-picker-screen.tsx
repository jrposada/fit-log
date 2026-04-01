import { useNavigation } from '@react-navigation/native';
import type { ImagePickerOptions, PermissionResponse } from 'expo-image-picker';
import * as ExpoImagePicker from 'expo-image-picker';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';

import Header from '../../navigation/header';
import { accent } from '../theme';
import { useToast } from '../toast';
import { ImagePickerEvents, ImagePickerResult } from './image-picker-events';
import { styles } from './image-picker-screen.styles';

type PermissionState = {
  status: 'undetermined' | 'granted' | 'denied';
  canAskAgain: boolean;
};

const INITIAL_PERMISSION: PermissionState = {
  status: 'undetermined',
  canAskAgain: true,
};

function toPermissionState(response: PermissionResponse): PermissionState {
  if (response.granted) return { status: 'granted', canAskAgain: true };
  return {
    status: response.status === 'undetermined' ? 'undetermined' : 'denied',
    canAskAgain: response.canAskAgain,
  };
}

const ImagePickerScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [cameraPermission, setCameraPermission] =
    useState<PermissionState>(INITIAL_PERMISSION);
  const [libraryPermission, setLibraryPermission] =
    useState<PermissionState>(INITIAL_PERMISSION);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t('climbing.select_image')}
          mode="modal"
          back
          onBackPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, t]);

  // Check permissions on mount
  useEffect(() => {
    (async () => {
      const [camera, library] = await Promise.all([
        ExpoImagePicker.getCameraPermissionsAsync(),
        ExpoImagePicker.getMediaLibraryPermissionsAsync(),
      ]);
      setCameraPermission(toPermissionState(camera));
      setLibraryPermission(toPermissionState(library));
    })();
  }, []);

  const handleImageSelection = useCallback(
    async (source: 'camera' | 'library') => {
      setIsProcessing(true);

      const options: ImagePickerOptions = {
        allowsEditing: true,
        allowsMultipleSelection: false,
        base64: true,
        quality: 0.8,
      };

      try {
        const result =
          source === 'camera'
            ? await ExpoImagePicker.launchCameraAsync(options)
            : await ExpoImagePicker.launchImageLibraryAsync(options);

        if (result.canceled || !result.assets || result.assets.length === 0) {
          setIsProcessing(false);
          return;
        }

        const asset = result.assets[0];
        const basename = asset.uri.split('/').pop();

        if (!asset.base64 || !asset.mimeType || !asset.fileSize || !basename) {
          setIsProcessing(false);
          toast.show(t('climbing.failed_retrieve_image_data'), 'destructive');
          return;
        }

        const imageData: ImagePickerResult = {
          base64: asset.base64,
          basename,
          fileSize: asset.fileSize,
          height: asset.height,
          mimeType: asset.mimeType,
          uri: asset.uri,
          width: asset.width,
        };

        ImagePickerEvents.emit(imageData);
        navigation.goBack();
      } catch (error: unknown) {
        const message =
          source === 'camera' && String(error).includes('not available')
            ? t('climbing.camera_not_available')
            : t('climbing.failed_process_image');
        toast.show(message, 'destructive');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    },
    [navigation, toast, t]
  );

  const requestAndHandle = useCallback(
    async (
      source: 'camera' | 'library',
      requestFn: () => Promise<PermissionResponse>,
      setPermission: (state: PermissionState) => void
    ) => {
      const response = await requestFn();
      const state = toPermissionState(response);
      setPermission(state);

      if (state.status === 'granted') {
        handleImageSelection(source);
      } else {
        const label =
          source === 'camera'
            ? t('climbing.camera_permission_denied')
            : t('climbing.library_permission_denied');
        toast.show(label, 'destructive');
      }
    },
    [handleImageSelection, toast, t]
  );

  const handleTakePhoto = async () => {
    await requestAndHandle(
      'camera',
      ExpoImagePicker.requestCameraPermissionsAsync,
      setCameraPermission
    );
  };

  const handlePickFromLibrary = async () => {
    await requestAndHandle(
      'library',
      ExpoImagePicker.requestMediaLibraryPermissionsAsync,
      setLibraryPermission
    );
  };

  const isCameraBlocked =
    cameraPermission.status === 'denied' && !cameraPermission.canAskAgain;
  const isLibraryBlocked =
    libraryPermission.status === 'denied' && !libraryPermission.canAskAgain;

  return (
    <View style={styles.container}>
      <View style={styles.selectionContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color={accent.primary} />
        ) : (
          <>
            <Text style={styles.selectionTitle}>
              {t('climbing.choose_image_source')}
            </Text>

            <Pressable
              style={[
                styles.selectionButton,
                isCameraBlocked && styles.selectionButtonDisabled,
              ]}
              onPress={isCameraBlocked ? undefined : handleTakePhoto}
              disabled={isCameraBlocked}
            >
              <Text style={styles.selectionIcon}>📷</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionButtonText,
                    isCameraBlocked && styles.selectionButtonTextDisabled,
                  ]}
                >
                  {t('climbing.take_photo')}
                </Text>
                {isCameraBlocked && (
                  <Pressable onPress={() => Linking.openSettings()}>
                    <Text style={styles.permissionHint}>
                      {t('climbing.camera_denied_open_settings')}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.selectionButton,
                isLibraryBlocked && styles.selectionButtonDisabled,
              ]}
              onPress={isLibraryBlocked ? undefined : handlePickFromLibrary}
              disabled={isLibraryBlocked}
            >
              <Text style={styles.selectionIcon}>🖼️</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionButtonText,
                    isLibraryBlocked && styles.selectionButtonTextDisabled,
                  ]}
                >
                  {t('climbing.choose_from_library')}
                </Text>
                {isLibraryBlocked && (
                  <Pressable onPress={() => Linking.openSettings()}>
                    <Text style={styles.permissionHint}>
                      {t('climbing.library_denied_open_settings')}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default ImagePickerScreen;
