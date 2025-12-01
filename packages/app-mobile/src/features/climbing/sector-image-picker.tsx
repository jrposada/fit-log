import { FunctionComponent, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ImagePicker, { ImagePickerResult } from '../../library/image-picker';

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
  const [imageData, setImageData] = useState<ImagePickerResult | null>(null);
  const [sectorName, setSectorName] = useState(`Sector ${initialSectorNumber}`);
  const [description, setDescription] = useState('');
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);

  const handleImageSelected = (result: ImagePickerResult) => {
    setImageData(result);
  };

  const handleSave = () => {
    if (!imageData || !sectorName.trim()) {
      Alert.alert('Error', 'Please select an image and enter a sector name');
      return;
    }

    onSave({
      name: sectorName.trim(),
      description: description.trim() || undefined,
      imageUri: imageData.imageUri,
      imageWidth: imageData.imageWidth,
      imageHeight: imageData.imageHeight,
      imageFileSize: imageData.imageFileSize,
    });

    // Reset form
    setImageData(null);
    setSectorName(`Sector ${initialSectorNumber + 1}`);
    setDescription('');
    setShowDescriptionInput(false);
  };

  const handleCancel = () => {
    setImageData(null);
    setSectorName(`Sector ${initialSectorNumber}`);
    setDescription('');
    setShowDescriptionInput(false);
    onCancel();
  };

  return (
    <ImagePicker
      visible={visible}
      onImageSelected={handleImageSelected}
      onCancel={handleCancel}
      title={imageData ? 'Add Sector' : 'Select Image'}
    >
      {(image) => (
        <View style={styles.formContainer}>
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
    </ImagePicker>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
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
