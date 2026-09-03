import { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import { ClimbSearchResult } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { Location } from '@jrposada/fit-log-shared/models/locations/location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTabBarOverlayHeight } from '../../../common/tab-bar-overlay/use-tab-bar-overlay-height';
import EmptyState from '../../../library/empty-state';
import { Icon } from '../../../library/icon';
import LoadingState from '../../../library/loading-state';
import { accent, spacing } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { RootStackParamList } from '../../../types/routes';
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
  const tabBarOverlayHeight = useTabBarOverlayHeight();
  const overlayClearance = tabBarOverlayHeight + spacing.sm;

  // mapPadding is an imperative MapView prop, not a style, so it can't be
  // driven directly by a Reanimated style — the shared value is bridged back
  // to JS state to animate it in step with the flyover's own transitions.
  const overlayClearanceValue = useSharedValue(overlayClearance);
  const [mapPaddingBottom, setMapPaddingBottom] = useState(overlayClearance);

  useEffect(() => {
    // Matches the bare `LinearTransition` used by the flyover (its default
    // resolves to withTiming(300, Easing.inOut(Easing.quad))).
    overlayClearanceValue.value = withTiming(overlayClearance, {
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    });
  }, [overlayClearance, overlayClearanceValue]);

  useAnimatedReaction(
    () => overlayClearanceValue.value,
    (current) => {
      scheduleOnRN(setMapPaddingBottom, current);
    }
  );

  const detailCardAnimatedStyle = useAnimatedStyle(() => ({
    bottom: overlayClearanceValue.value,
  }));

  const [selectedLocation, setSelectedLocation] = useState<
    (Location & { sports: Sport[] }) | null
  >(null);

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

  const routesCount = (location: Location) =>
    location.sectors.reduce((total, sector) => total + sector.climbs.length, 0);

  return (
    <LoadingState isLoading={isLoading}>
      {pins.length === 0 ? (
        <EmptyState message={t('explore.map_empty')} />
      ) : (
        <View style={styles.container}>
          <MapView
            provider={
              Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
            }
            style={styles.map}
            initialRegion={initialRegion}
            mapPadding={{
              top: 0,
              left: spacing.md,
              right: 0,
              bottom: mapPaddingBottom,
            }}
            onPress={() => setSelectedLocation(null)}
          >
            {pins.map((pin) => {
              const isSelected = pin.id === selectedLocation?.id;
              return (
                <Marker
                  key={pin.id}
                  coordinate={{
                    latitude: pin.latitude,
                    longitude: pin.longitude,
                  }}
                  title={pin.name}
                  onPress={() => setSelectedLocation(pin)}
                >
                  <View style={[styles.pin, isSelected && styles.pinSelected]}>
                    <Icon
                      icon="landscape"
                      size="sm"
                      color={isSelected ? accent.onAccent : accent.primary}
                    />
                  </View>
                </Marker>
              );
            })}
          </MapView>

          {selectedLocation && (
            <Animated.View style={[styles.detailCard, detailCardAnimatedStyle]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LocationDetail', {
                    locationId: selectedLocation.id,
                  })
                }
              >
                <Typography size="title">{selectedLocation.name}</Typography>
                <View style={styles.detailStatsRow}>
                  <View style={styles.detailStat}>
                    <Typography size="caption" color="secondary">
                      {t('explore.pin_sectors', {
                        count: selectedLocation.sectors.length,
                      })}
                    </Typography>
                  </View>
                  <View style={styles.detailStat}>
                    <Typography size="dataSm" color="accent">
                      {t('explore.pin_routes', {
                        count: routesCount(selectedLocation),
                      })}
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </LoadingState>
  );
};

export default ExploreMapView;
