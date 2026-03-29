import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hold } from '@shared/models/climb/climb';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import InteractiveImage from '../../../library/interactive-image';
import LoadingState from '../../../library/loading-state';
import Section from '../../../library/section';
import { HEADER_FIXED_HEIGHT } from '../../../navigation/header.styles';
import { ClimbingParamList } from '../types';
import { styles } from './climb-detail-screen.styles';

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
    return <LoadingState style={styles.loadingContainer} />;
  }

  if (!climb) {
    return <EmptyState message={t('climbing.climb_not_found')} />;
  }

  return (
    <ScrollView style={styles.container}>
      <InteractiveImage
        source={{ uri: climb.image.imageUrl }}
        style={[
          styles.imageContainer,
          { height: SCREEN_HEIGHT - (insets.top + HEADER_FIXED_HEIGHT) },
        ]}
        imageStyle={styles.image}
      >
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
      </InteractiveImage>

      <View style={styles.footer}>
        {climb.description && (
          <Section title={t('climbing.description')}>
            <Text style={styles.description}>{climb.description}</Text>
          </Section>
        )}

        <Button
          variant="destructive"
          title={
            deleteClimb.isPending
              ? t('climbing.deleting')
              : t('climbing.delete_climb_button')
          }
          onPress={handleDelete}
          disabled={deleteClimb.isPending}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
};

export default ClimbDetailScreen;
export type { ClimbDetailRouteProp };
