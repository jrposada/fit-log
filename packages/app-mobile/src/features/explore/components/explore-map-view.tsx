import { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import { ClimbSearchResult } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { Location } from '@jrposada/fit-log-shared/models/locations/location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import EmptyState from '../../../library/empty-state';
import LoadingState from '../../../library/loading-state';
import { RootStackParamList } from '../../../types/routes';
import { SPORT_ICONS } from '../../feed/sport-icons';
import { styles } from './explore-map-view.styles';

type ExploreMapViewNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_REGION = {
  latitude: 32.7157,
  longitude: -117.1611,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

export interface ExploreMapViewProps {
  locations: Location[];
  climbs: ClimbSearchResult[];
  isLoading: boolean;
  hasActiveFilters: boolean;
}

const ExploreMapView: FunctionComponent<ExploreMapViewProps> = ({
  locations,
  climbs,
  isLoading,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<ExploreMapViewNavigationProp>();

  // A location with no sport-having sessions is meaningless on a map that
  // shows "every place the user trains" — never show a dead pin.
  const locationsWithSports = useMemo(
    () =>
      locations.filter(
        (location): location is typeof location & { sports: Sport[] } =>
          (location.sports?.length ?? 0) > 0
      ),
    [locations]
  );

  const matchedLocationIds = useMemo(() => {
    if (!hasActiveFilters) {
      return null;
    }
    return new Set(
      climbs.map((climb) =>
        typeof climb.location === 'string' ? climb.location : climb.location.id
      )
    );
  }, [climbs, hasActiveFilters]);

  const pins = useMemo(
    () =>
      matchedLocationIds
        ? locationsWithSports.filter((location) =>
            matchedLocationIds.has(location.id)
          )
        : locationsWithSports,
    [locationsWithSports, matchedLocationIds]
  );

  const initialRegion = useMemo(() => {
    const first = pins[0];
    return first
      ? {
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 4,
          longitudeDelta: 4,
        }
      : DEFAULT_REGION;
  }, [pins]);

  return (
    <LoadingState isLoading={isLoading}>
      {pins.length === 0 ? (
        <EmptyState message={t('explore.map_empty')} />
      ) : (
        <MapView
          provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              coordinate={{
                latitude: pin.latitude,
                longitude: pin.longitude,
              }}
              title={pin.name}
              onPress={() =>
                navigation.navigate('LocationDetail', { locationId: pin.id })
              }
            >
              <Text style={styles.pin}>{SPORT_ICONS[pin.sports[0]!]}</Text>
            </Marker>
          ))}
        </MapView>
      )}
    </LoadingState>
  );
};

export default ExploreMapView;
