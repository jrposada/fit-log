import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hold } from '@shared/models/boulder';
import { useBouldersPut } from '@shared-react/api/boulders/use-boulders-put';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  GestureResponderEvent,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { config } from '../config';
import { RootStackParamList } from '../types/routes';

type BoulderEditorScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BoulderEditor'>;
  route: RouteProp<RootStackParamList, 'BoulderEditor'>;
};

const HOLD_RADIUS = 20;

const BoulderEditorScreen: FunctionComponent<BoulderEditorScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { imageUri } = route.params;
  const [holds, setHolds] = useState<Hold[]>([]);
  const [imageLayout, setImageLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const { mutate: saveBoulder, isPending } = useBouldersPut({
    apiBaseUrl: config.apiBaseUrl,
    onSuccess: () => {
      Alert.alert(
        t('boulder.save_success_title'),
        t('boulder.save_success_message', { count: holds.length }),
        [
          {
            text: t('actions.ok'),
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]
      );
    },
    onError: (error) => {
      console.error('Failed to save boulder:', error);
      Alert.alert(
        t('boulder.save_error_title'),
        t('boulder.save_error_message'),
        [{ text: t('actions.ok') }]
      );
    },
  });

  const handleImageLayout = (event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    setImageLayout({ width, height, x, y });
  };

  const handleImagePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;

    // Convert absolute coordinates to percentage (0-1)
    const relativeX = locationX / imageLayout.width;
    const relativeY = locationY / imageLayout.height;

    const newHold: Hold = {
      x: relativeX,
      y: relativeY,
    };

    setHolds([...holds, newHold]);
  };

  const handleHoldPress = (index: number) => {
    Alert.alert(
      t('boulder.remove_hold_title'),
      t('boulder.remove_hold_message'),
      [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
        {
          text: t('actions.remove'),
          onPress: () => {
            setHolds(holds.filter((_, i) => i !== index));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSave = () => {
    if (holds.length === 0) {
      Alert.alert(t('boulder.no_holds_title'), t('boulder.no_holds_message'), [
        { text: t('actions.ok') },
      ]);
      return;
    }

    saveBoulder({
      image: imageUri,
      holds,
      name: 'New Boulder', // TODO: Add name input field
      description: '', // TODO: Add description input field
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('boulder.editor_title')}</Text>
        <Text style={styles.subtitle}>{t('boulder.editor_subtitle')}</Text>
        <Text style={styles.holdCount}>
          {t('boulder.holds_count', { count: holds.length })}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Pressable onPress={handleImagePress} style={styles.imagePressable}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLayout={handleImageLayout}
          />
        </Pressable>

        {/* Render holds */}
        {holds.map((hold, index) => {
          const absoluteX = hold.x * imageLayout.width;
          const absoluteY = hold.y * imageLayout.height;

          return (
            <TouchableOpacity
              key={`hold-${index}`}
              style={[
                styles.hold,
                {
                  left: imageLayout.x + absoluteX - HOLD_RADIUS,
                  top: imageLayout.y + absoluteY - HOLD_RADIUS,
                },
              ]}
              onPress={() => handleHoldPress(index)}
            >
              <View style={styles.holdInner} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>{t('actions.cancel')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (holds.length === 0 || isPending) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isPending}
        >
          <Text style={styles.saveButtonText}>
            {isPending ? t('actions.saving') : t('actions.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  holdCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hold: {
    position: 'absolute',
    width: HOLD_RADIUS * 2,
    height: HOLD_RADIUS * 2,
    borderRadius: HOLD_RADIUS,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdInner: {
    width: HOLD_RADIUS,
    height: HOLD_RADIUS,
    borderRadius: HOLD_RADIUS / 2,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BoulderEditorScreen;
