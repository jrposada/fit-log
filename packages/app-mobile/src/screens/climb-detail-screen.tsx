import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hold } from '@shared/models/climb/climb';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_FIXED_HEIGHT } from '../navigation/header.styles';
import { ClimbingParamList } from '../types/routes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbDetailNavigationProp>();
  const route = useRoute<ClimbDetailRouteProp>();
  const insets = useSafeAreaInsets();

  const { climbId } = route.params;
  const { data: climb, isLoading } = useClimbsById({
    id: climbId,
  });
  const deleteClimb = useClimbsDelete({
    onSuccess: () => {
      Alert.alert(
        t('climbing.climb_deleted_title'),
        t('climbing.climb_deleted_message'),
        [{ text: t('actions.ok'), onPress: () => navigation.goBack() }]
      );
    },
    onError: (error) => {
      Alert.alert(t('climbing.error'), error);
    },
  });

  const handleDelete = () => {
    Alert.alert(
      t('climbing.delete_climb_title'),
      t('climbing.delete_climb_message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.delete'),
          style: 'destructive',
          onPress: () => deleteClimb.mutate({ id: climbId }),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!climb) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFoundText}>{t('climbing.climb_not_found')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          { height: SCREEN_HEIGHT - (insets.top + HEADER_FIXED_HEIGHT) },
        ]}
      >
        <Image source={{ uri: climb.image.imageUrl }} style={styles.image} />
        {climb.holds.length > 0 && (
          <View style={styles.holdsOverlay}>
            {climb.holds.map((hold: Hold, index: number) => (
              <View
                key={`hold-${index}`}
                style={[
                  styles.hold,
                  {
                    left: `${hold.x * 100}%`,
                    top: `${hold.y * 100}%`,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {climb.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>{t('climbing.description')}</Text>
            <Text style={styles.description}>{climb.description}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleteClimb.isPending}
        >
          <Text style={styles.deleteButtonText}>
            {deleteClimb.isPending
              ? t('climbing.deleting')
              : t('climbing.delete_climb_button')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  holdsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hold: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -12,
    marginTop: -12,
  },
  noImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
  },
  footer: {
    padding: 16,
  },
  descriptionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClimbDetailScreen;
export type { ClimbDetailRouteProp };
