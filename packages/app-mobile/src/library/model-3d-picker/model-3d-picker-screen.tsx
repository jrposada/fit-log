import { useNavigation } from '@react-navigation/native';
import * as ExpoDocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
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

import Header from '../../navigation/common/header';
import { Icon } from '../icon';
import { accent, ink } from '../theme';
import { useToast } from '../toast';
import { Model3dPickerEvents } from './model-3d-picker-events';
import { styles } from './model-3d-picker-screen.styles';

type PermissionState = {
  status: 'undetermined' | 'granted' | 'denied';
  canAskAgain: boolean;
};

const INITIAL_PERMISSION: PermissionState = {
  status: 'undetermined',
  canAskAgain: true,
};

/** Mobile OSes are unreliable at reporting `model/*` MIME types, so this is
 * a best-effort fallback derived from the extension, matching the backend's
 * own extension map (see `Model3dProcessor`). */
const MODEL_MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  glb: 'model/gltf-binary',
  gltf: 'model/gltf+json',
  obj: 'model/obj',
  stl: 'model/stl',
  usdz: 'model/vnd.usdz+zip',
};

function guessModelMimeType(filename: string, mimeType?: string): string {
  if (mimeType && mimeType !== 'application/octet-stream') {
    return mimeType;
  }
  const extension = filename.split('.').pop()?.toLowerCase();
  return (
    (extension && MODEL_MIME_TYPE_BY_EXTENSION[extension]) ||
    mimeType ||
    'model/gltf-binary'
  );
}

function toPermissionState(response: PermissionResponse): PermissionState {
  if (response.granted) return { status: 'granted', canAskAgain: true };
  return {
    status: response.status === 'undetermined' ? 'undetermined' : 'denied',
    canAskAgain: response.canAskAgain,
  };
}

const Model3dPickerScreen: FunctionComponent = () => {
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
          title={t('climbing.select_model3d_source')}
          mode="modal"
          back
          onBackPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, t]);

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

  const handleVideoSelection = useCallback(
    async (source: 'camera' | 'library') => {
      setIsProcessing(true);

      const options: ImagePickerOptions = {
        mediaTypes: ['videos'],
        quality: 0.8,
      };

      try {
        const result =
          source === 'camera'
            ? await ExpoImagePicker.launchCameraAsync(options)
            : await ExpoImagePicker.launchImageLibraryAsync(options);

        if (result.canceled || !result.assets || !result.assets.length) {
          setIsProcessing(false);
          return;
        }

        const asset = result.assets[0]!;
        const mimeType = asset.mimeType || 'video/mp4';
        const base64 = await new File(asset.uri).base64();

        Model3dPickerEvents.emit({ kind: 'video', base64, mimeType });
        navigation.goBack();
      } catch (error: unknown) {
        const message =
          source === 'camera' && String(error).includes('not available')
            ? t('climbing.camera_not_available')
            : t('climbing.failed_process_video');
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
        handleVideoSelection(source);
      } else {
        const label =
          source === 'camera'
            ? t('climbing.camera_permission_denied')
            : t('climbing.library_permission_denied');
        toast.show(label, 'destructive');
      }
    },
    [handleVideoSelection, toast, t]
  );

  const handleRecordVideo = async () => {
    await requestAndHandle(
      'camera',
      ExpoImagePicker.requestCameraPermissionsAsync,
      setCameraPermission
    );
  };

  const handlePickVideoFromLibrary = async () => {
    await requestAndHandle(
      'library',
      ExpoImagePicker.requestMediaLibraryPermissionsAsync,
      setLibraryPermission
    );
  };

  const handleUploadModelFile = async () => {
    setIsProcessing(true);

    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || !result.assets.length) {
        setIsProcessing(false);
        return;
      }

      const asset = result.assets[0]!;
      const mimeType = guessModelMimeType(asset.name, asset.mimeType);
      const base64 = await new File(asset.uri).base64();

      Model3dPickerEvents.emit({
        kind: 'model',
        base64,
        mimeType,
        filename: asset.name,
      });
      navigation.goBack();
    } catch (error: unknown) {
      toast.show(t('climbing.failed_process_model_file'), 'destructive');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
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
              {t('climbing.select_model3d_source')}
            </Text>

            <Pressable
              style={[
                styles.selectionButton,
                isCameraBlocked && styles.selectionButtonDisabled,
              ]}
              onPress={isCameraBlocked ? undefined : handleRecordVideo}
              disabled={isCameraBlocked}
            >
              <Icon
                icon="videocam"
                size="lg"
                color={ink.primary}
                style={styles.selectionIcon}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionButtonText,
                    isCameraBlocked && styles.selectionButtonTextDisabled,
                  ]}
                >
                  {t('climbing.record_video')}
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
              onPress={
                isLibraryBlocked ? undefined : handlePickVideoFromLibrary
              }
              disabled={isLibraryBlocked}
            >
              <Icon
                icon="video-library"
                size="lg"
                color={ink.primary}
                style={styles.selectionIcon}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionButtonText,
                    isLibraryBlocked && styles.selectionButtonTextDisabled,
                  ]}
                >
                  {t('climbing.choose_video_from_library')}
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

            <Pressable
              style={styles.selectionButton}
              onPress={handleUploadModelFile}
            >
              <Icon
                icon="upload-file"
                size="lg"
                color={ink.primary}
                style={styles.selectionIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.selectionButtonText}>
                  {t('climbing.upload_model_file')}
                </Text>
              </View>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Model3dPickerScreen;
