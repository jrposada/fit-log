import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { useClimbsDelete } from '@shared-react/api/climbs/use-climbs-delete';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, LayoutChangeEvent, Text } from 'react-native';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import LoadingState from '../../../library/loading-state';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import { colors } from '../../../library/theme';
import ClimbImage from '../components/climb-image';
import { ClimbingParamList } from '../types';

type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

const ClimbDetailScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbDetailNavigationProp>();
  const route = useRoute<ClimbDetailRouteProp>();
  const [scrollHeight, setScrollHeight] = useState(0);

  const handleScrollLayout = (event: LayoutChangeEvent) => {
    setScrollHeight(event.nativeEvent.layout.height);
  };

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

  return (
    <LoadingState
      isLoading={isLoading}
      style={{ backgroundColor: colors.screenBackground }}
    >
      {!climb ? (
        <EmptyState message={t('climbing.climb_not_found')} />
      ) : (
        <Screen
          scrollViewProps={{ onLayout: handleScrollLayout }}
          footer={
            <Button
              variant="destructive"
              title={
                deleteClimb.isPending
                  ? t('climbing.deleting')
                  : t('climbing.delete_climb_button')
              }
              onPress={handleDelete}
              disabled={deleteClimb.isPending}
            />
          }
        >
          <ClimbImage
            source={{ uri: climb.image.imageUrl }}
            holds={climb.holds}
            style={{ height: scrollHeight }}
          />

          {climb.description && (
            <Section spacing="lg" title={t('climbing.description')}>
              <Text>{climb.description}</Text>
            </Section>
          )}
        </Screen>
      )}
    </LoadingState>
  );
};

export default ClimbDetailScreen;
export type { ClimbDetailRouteProp };
