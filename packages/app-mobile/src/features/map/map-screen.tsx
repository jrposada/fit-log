import { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import { useLocations } from '@jrposada/fit-log-shared-react/api/locations/use-locations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import EmptyState from '../../library/empty-state';
import LoadingState from '../../library/loading-state';
import Tabs, { TabBarItem } from '../../library/tabs';
import { RootStackParamList } from '../../types/routes';
import { SPORT_ICONS } from '../feed/sport-icons';
import { styles } from './map-screen.styles';

type MapFilter = 'all' | Sport;

type MapNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_REGION = {
  latitude: 32.7157,
  longitude: -117.1611,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

const MapScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<MapNavigationProp>();
  const [filter, setFilter] = useState<MapFilter>('all');

  const {
    items: locations,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLocations();

  // The map needs every location up front, so keep pulling pages until
  // exhausted instead of exposing pagination on a map.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // A location with no sport-having sessions is meaningless on a map that
  // shows "every place the user trains" — never show a dead pin.
  const pins = useMemo(
    () =>
      locations.filter(
        (location): location is typeof location & { sports: Sport[] } =>
          (location.sports?.length ?? 0) > 0
      ),
    [locations]
  );

  const availableSports = useMemo(() => {
    const sports = new Set<Sport>();
    pins.forEach((pin) => pin.sports.forEach((sport) => sports.add(sport)));
    return Array.from(sports);
  }, [pins]);

  const filterItems: TabBarItem<MapFilter>[] = [
    { id: 'all', label: t('common.filter_all') },
    ...availableSports.map((sport) => ({
      id: sport,
      label: t(`${sport}.title`),
    })),
  ];

  const visiblePins = useMemo(
    () =>
      filter === 'all'
        ? pins
        : pins.filter((pin) => pin.sports.includes(filter)),
    [pins, filter]
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
    <View style={styles.container}>
      <Tabs.Bar<MapFilter>
        items={filterItems}
        activeId={filter}
        onChange={setFilter}
      />

      <LoadingState isLoading={isLoading}>
        {pins.length === 0 ? (
          <EmptyState message={t('map.empty')} />
        ) : (
          <MapView
            provider={
              Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
            }
            style={styles.map}
            initialRegion={initialRegion}
          >
            {visiblePins.map((pin) => (
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
    </View>
  );
};

export default MapScreen;
