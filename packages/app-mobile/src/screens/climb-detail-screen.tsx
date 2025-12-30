import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hold } from '@shared/models/climb/climb';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClimbingParamList } from '../types/routes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 60;

type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbDetailNavigationProp>();
  const route = useRoute<ClimbDetailRouteProp>();

  const { climbId } = route.params;
  const { data: climb, isLoading } = useClimbsById({
    id: climbId,
  });
  const { mutate: deleteClimb, isPending } = useClimbsDelete({
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
          onPress: () => deleteClimb({ id: climbId }),
        },
      ]
    );
  };

  const handleOpenMap = () => {
    if (!climb?.location?.latitude || !climb?.location?.longitude) {
      return;
    }

    const { latitude, longitude } = climb.location;
    const label = encodeURIComponent(climb.location.name || 'Location');

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
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

  const hasLocation = climb.location?.latitude && climb.location?.longitude;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name} numberOfLines={1}>
            {climb.name}
          </Text>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: beautifyGradeColor(climb.grade) },
            ]}
          >
            <Text style={styles.gradeText}>{climb.grade}</Text>
          </View>
        </View>
        {hasLocation && (
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Text style={styles.mapIcon}>📍</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Body - Image with holds overlay */}
      <View style={styles.imageContainer}>
        {climb.image?.imageUrl ? (
          <>
            <Image
              source={{ uri: climb.image.imageUrl }}
              style={styles.image}
            />
            {climb.holds?.length > 0 && (
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
          </>
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>{t('climbing.no_image')}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
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
          disabled={isPending}
        >
          <Text style={styles.deleteButtonText}>
            {isPending
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    height: HEADER_HEIGHT,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flexShrink: 1,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  mapIcon: {
    fontSize: 20,
  },
  imageContainer: {
    width: '100%',
    height: SCREEN_HEIGHT - HEADER_HEIGHT - 100,
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
