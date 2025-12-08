import type { ImagePickerOptions } from 'expo-image-picker';
import * as ExpoImagePicker from 'expo-image-picker';
import { t } from 'i18next';
import { FunctionComponent, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface ImagePickerResult {
  base64: string;
  basename: string;
  fileSize: number;
  height: number;
  mimeType: string;
  uri: string;
  width: number;
}

interface ImagePickerProps {
  visible: boolean;
  onImageSelected: (result: ImagePickerResult) => void;
  onCancel: () => void;
  title?: string;
}

const ImagePicker: FunctionComponent<ImagePickerProps> = ({
  visible,
  onImageSelected,
  onCancel,
  title,
}) => {
  const [imageFileSize, setImageFileSize] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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

      setImageUri(imageData.uri);
      setImageWidth(imageData.width);
      setImageHeight(imageData.height);
      setImageFileSize(imageData.fileSize);

      onImageSelected(imageData);
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to process image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromLibrary = async () => {
    await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    handleImageSelection('library');
  };

  const handleTakePhoto = async () => {
    await ExpoImagePicker.requestCameraPermissionsAsync();

    handleImageSelection('camera');
  };

  const handleCancel = () => {
    setImageUri(null);
    setImageWidth(0);
    setImageHeight(0);
    setImageFileSize(0);
    onCancel();
  };

  const imageData = imageUri
    ? {
        uri: imageUri,
        width: imageWidth,
        height: imageHeight,
        fileSize: imageFileSize,
      }
    : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={handleCancel}>
            <Text style={styles.cancelButton}>{t('actions.cancel')}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{title ?? 'Select Image'}</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {!imageData ? (
          <View style={styles.selectionContainer}>
            {isProcessing ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Text style={styles.selectionTitle}>Choose Image Source</Text>
                <Pressable
                  style={styles.selectionButton}
                  onPress={handleTakePhoto}
                >
                  <Text style={styles.selectionIcon}>📷</Text>
                  <Text style={styles.selectionButtonText}>Take Photo</Text>
                </Pressable>
                <Pressable
                  style={styles.selectionButton}
                  onPress={handlePickFromLibrary}
                >
                  <Text style={styles.selectionIcon}>🖼️</Text>
                  <Text style={styles.selectionButtonText}>
                    Choose from Library
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: imageData.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
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
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerPlaceholder: {
    width: 60,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 32,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  selectionButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
});

export default ImagePicker;
export type { ImagePickerProps };
