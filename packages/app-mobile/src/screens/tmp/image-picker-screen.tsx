import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../types/routes';

type ImagePickerScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ImagePicker'>;
};

const ImagePickerScreen: FunctionComponent<ImagePickerScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [libraryPermission, setLibraryPermission] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.granted);

      const libraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setLibraryPermission(libraryStatus.granted);
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    if (!libraryPermission) {
      Alert.alert(
        t('boulder.permission_required_title'),
        t('boulder.library_permission_message'),
        [{ text: t('actions.ok') }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('BoulderEditor', {
        imageUri: result.assets[0].uri,
      });
    }
  };

  const takePhoto = async () => {
    if (!cameraPermission) {
      Alert.alert(
        t('boulder.permission_required_title'),
        t('boulder.camera_permission_message'),
        [{ text: t('actions.ok') }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('BoulderEditor', {
        imageUri: result.assets[0].uri,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('boulder.image_picker_title')}</Text>

      <TouchableOpacity
        style={[styles.button, !cameraPermission && styles.buttonDisabled]}
        onPress={takePhoto}
        disabled={!cameraPermission}
      >
        <Text style={styles.buttonIcon}>📷</Text>
        <Text style={styles.buttonText}>{t('boulder.take_photo')}</Text>
        {!cameraPermission && (
          <Text style={styles.permissionText}>
            {t('boulder.camera_permission_required')}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !libraryPermission && styles.buttonDisabled]}
        onPress={pickImageFromLibrary}
        disabled={!libraryPermission}
      >
        <Text style={styles.buttonIcon}>🖼️</Text>
        <Text style={styles.buttonText}>
          {t('boulder.choose_from_library')}
        </Text>
        {!libraryPermission && (
          <Text style={styles.permissionText}>
            {t('boulder.library_permission_required')}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>{t('actions.cancel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  permissionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ImagePickerScreen;
