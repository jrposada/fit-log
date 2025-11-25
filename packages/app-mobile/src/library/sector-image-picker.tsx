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
  TextInput,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface SectorImagePickerProps {
  visible: boolean;
  initialSectorNumber?: number;
  onSave: (sectorData: {
    name: string;
    description?: string;
    imageUri: string;
    imageWidth: number;
    imageHeight: number;
    imageFileSize: number;
  }) => void;
  onCancel: () => void;
}

const SectorImagePicker: FunctionComponent<SectorImagePickerProps> = ({
  visible,
  initialSectorNumber = 1,
  onSave,
  onCancel,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageFileSize, setImageFileSize] = useState(0);
  const [sectorName, setSectorName] = useState(`Sector ${initialSectorNumber}`);
  const [description, setDescription] = useState('');
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
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
        setImageUri(asset.uri || null);
        setImageWidth(asset.width || 0);
        setImageHeight(asset.height || 0);
        setImageFileSize(asset.fileSize || 0);
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

  const handleSave = () => {
    if (!imageUri || !sectorName.trim()) {
      Alert.alert('Error', 'Please select an image and enter a sector name');
      return;
    }

    onSave({
      name: sectorName.trim(),
      description: description.trim() || undefined,
      imageUri,
      imageWidth,
      imageHeight,
      imageFileSize,
    });

    // Reset form
    setImageUri(null);
    setSectorName(`Sector ${initialSectorNumber + 1}`);
    setDescription('');
    setShowDescriptionInput(false);
  };

  const handleCancel = () => {
    setImageUri(null);
    setSectorName(`Sector ${initialSectorNumber}`);
    setDescription('');
    setShowDescriptionInput(false);
    onCancel();
  };

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
          <Text style={styles.headerTitle}>
            {imageUri ? 'Add Sector' : 'Select Image'}
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {!imageUri ? (
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
          <View style={styles.formContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />

            <View style={styles.formSection}>
              <Text style={styles.label}>
                Sector Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={sectorName}
                onChangeText={setSectorName}
                placeholder="Enter sector name"
                maxLength={50}
                autoFocus
              />
              <Text style={styles.helperText}>
                {sectorName.length}/50 characters
              </Text>
            </View>

            {showDescriptionInput ? (
              <View style={styles.formSection}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add description..."
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.helperText}>
                  {description.length}/200 characters
                </Text>
              </View>
            ) : (
              <Pressable
                style={styles.addDescriptionButton}
                onPress={() => setShowDescriptionInput(true)}
              >
                <Text style={styles.addDescriptionText}>
                  ▼ Add description (optional)
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.saveButton,
                !sectorName.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!sectorName.trim()}
            >
              <Text style={styles.saveButtonText}>✓ Add Sector</Text>
            </Pressable>
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
  formContainer: {
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
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff3b30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  addDescriptionButton: {
    padding: 12,
    marginBottom: 16,
  },
  addDescriptionText: {
    fontSize: 14,
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SectorImagePicker;
