import { useRoute } from '@react-navigation/native';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { FunctionComponent } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import GradeBadge from '../features/climbing/grade-badge';
import { ClimbDetailRouteProp } from '../screens/climb-detail-screen';
import Header from './header';

const ClimbDetailHeader: FunctionComponent = () => {
  const route = useRoute<ClimbDetailRouteProp>();

  const { climbId } = route.params;
  const { data: climb, isLoading } = useClimbsById({
    id: climbId,
  });

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

  return (
    <Header
      title={climb?.name}
      extra={<GradeBadge grade={climb?.grade ?? 'V0'} />}
      action={
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
          <Text style={styles.mapIcon}>📍</Text>
        </TouchableOpacity>
      }
      loading={isLoading}
      back
    />
  );
};

const styles = StyleSheet.create({
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
});

export default ClimbDetailHeader;
