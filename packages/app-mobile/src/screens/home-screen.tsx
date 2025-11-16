import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Boulder } from '@shared/models/boulder';
import { useBoulders } from '@shared-react/api/boulders/use-boulders';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { config } from '../config';
import { RootStackParamList } from '../types/routes';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: FunctionComponent<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { data: boulders = [], isLoading } = useBoulders({
    apiBaseUrl: config.apiBaseUrl,
  });

  const handleCreateBoulder = () => {
    navigation.navigate('ImagePicker');
  };

  const renderBoulderItem = ({ item }: { item: Boulder }) => (
    <View style={styles.boulderCard}>
      <Image source={{ uri: item.image }} style={styles.boulderImage} />
      <View style={styles.boulderInfo}>
        <Text style={styles.boulderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.boulderHolds}>
          {t('boulder.holds_label', { count: item.holds.length })}
        </Text>
      </View>
    </View>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateBoulder}
      >
        <Text style={styles.createButtonText}>📷</Text>
        <Text style={styles.createButtonLabel}>
          {t('boulder.create_button')}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : boulders.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{t('boulder.empty_state')}</Text>
        </View>
      ) : (
        <FlatList
          data={boulders}
          renderItem={renderBoulderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.boulderList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonText: {
    fontSize: 48,
    marginBottom: 8,
  },
  createButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  boulderList: {
    gap: 10,
  },
  boulderCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  boulderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  boulderInfo: {
    padding: 10,
  },
  boulderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  boulderHolds: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default HomeScreen;
