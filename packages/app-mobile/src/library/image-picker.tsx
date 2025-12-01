import { FunctionComponent, ReactNode, useState } from 'react';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export interface ImagePickerResult {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  imageFileSize: number;
}

interface ImagePickerProps {
  visible: boolean;
  onImageSelected: (result: ImagePickerResult) => void;
  onCancel: () => void;
  title?: string;
  children?: (imageData: ImagePickerResult) => ReactNode;
}

const ImagePicker: FunctionComponent<ImagePickerProps> = ({
  visible,
  onImageSelected,
  onCancel,
  title = 'Select Image',
  children,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageFileSize, setImageFileSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelection = async (source: 'camera' | 'library') => {
    setIsProcessing(true);

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 2048,
      maxHeight: 2048,
    };

    try {
      const result =
        source === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.didCancel) {
        setIsProcessing(false);
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        setIsProcessing(false);
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const imageData: ImagePickerResult = {
          imageUri: asset.uri || '',
          imageWidth: asset.width || 0,
          imageHeight: asset.height || 0,
          imageFileSize: asset.fileSize || 0,
        };

        setImageUri(imageData.imageUri);
        setImageWidth(imageData.imageWidth);
        setImageHeight(imageData.imageHeight);
        setImageFileSize(imageData.imageFileSize);

        onImageSelected(imageData);
      }
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to process image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromLibrary = () => {
    handleImageSelection('library');
  };

  const handleTakePhoto = () => {
    handleImageSelection('camera');
  };

  const handleCancel = () => {
    setImageUri(null);
    setImageWidth(0);
    setImageHeight(0);
    setImageFileSize(0);
    onCancel();
  };

  const imageData: ImagePickerResult | null = imageUri
    ? { imageUri, imageWidth, imageHeight, imageFileSize }
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
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
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
              source={{ uri: imageData.imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            {children && children(imageData)}
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
