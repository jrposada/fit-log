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
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClimbingParamList } from '../types/routes';

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
      {climb.image?.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: climb.image.imageUrl }} style={styles.image} />
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
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{climb.name}</Text>
          <View style={styles.gradeContainer}>
            <Text
              style={[
                styles.grade,
                { backgroundColor: beautifyGradeColor(climb.grade) },
              ]}
            >
              {climb.grade}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('climbing.location')}</Text>
            <Text style={styles.value}>{climb.location?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('climbing.sector')}</Text>
            <Text style={styles.value}>{climb.sector?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('climbing.created_at')}</Text>
            <Text style={styles.value}>
              {new Date(climb.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {climb.holds?.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('climbing.holds')}</Text>
              <Text style={styles.value}>{climb.holds.length}</Text>
            </View>
          )}
        </View>

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
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginRight: 12,
  },
  gradeContainer: {},
  grade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
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
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClimbDetailScreen;
