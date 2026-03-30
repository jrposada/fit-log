import { useNavigation } from '@react-navigation/native';
import type { ImagePickerOptions } from 'expo-image-picker';
import * as ExpoImagePicker from 'expo-image-picker';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import Header from '../../navigation/header';
import { colors } from '../theme';
import { ImagePickerEvents, ImagePickerResult } from './image-picker-events';
import { styles } from './image-picker-screen.styles';

const ImagePickerScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleImageSelection = async (source: 'camera' | 'library') => {
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
        Alert.alert('Error', 'Failed to retrieve image data');
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
      Alert.alert('Error', 'Failed to process image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTakePhoto = async () => {
    await ExpoImagePicker.requestCameraPermissionsAsync();
    handleImageSelection('camera');
  };

  const handlePickFromLibrary = async () => {
    await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    handleImageSelection('library');
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectionContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        ) : (
          <>
            <Text style={styles.selectionTitle}>
              {t('climbing.choose_image_source')}
            </Text>
            <Pressable style={styles.selectionButton} onPress={handleTakePhoto}>
              <Text style={styles.selectionIcon}>📷</Text>
              <Text style={styles.selectionButtonText}>
                {t('climbing.take_photo')}
              </Text>
            </Pressable>
            <Pressable
              style={styles.selectionButton}
              onPress={handlePickFromLibrary}
            >
              <Text style={styles.selectionIcon}>🖼️</Text>
              <Text style={styles.selectionButtonText}>
                {t('climbing.choose_from_library')}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default ImagePickerScreen;
