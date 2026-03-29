import { useRoute } from '@react-navigation/native';
import { useClimbsById } from '@shared-react/api/climbs/use-climbs-by-id';
import { FunctionComponent } from 'react';
import { Linking, Platform } from 'react-native';

import IconButton from '../../library/icon-button';
import Header from '../../navigation/header';
import GradeBadge from './components/grade-badge';
import { ClimbDetailRouteProp } from './screens/climb-detail-screen';

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
      action={<IconButton icon="📍" onPress={handleOpenMap} />}
      loading={isLoading}
      back
    />
  );
};

export default ClimbDetailHeader;
