import { useClimbs } from '@shared-react/api/climbs/use-climbs';
import { useLocations } from '@shared-react/api/locations/use-locations';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Separator from '../../../library/separator/separator';
import ClimbCard from './climb-card';
import LocationSelector from './location-selector';

const QuickLogTab: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: locations = [], isLoading: isLoadingLocations } =
    useLocations();
  const { data: climbs = [], isLoading: isLoadingClimbs } = useClimbs({
    limit: 3,
  });
  const [location, setLocation] = useState<string>(locations[0]?.name ?? '');

  const handleLog = (id: string) => {
    console.log('log route', id);
  };

  if (isLoadingLocations || isLoadingClimbs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2962ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LocationSelector
        locations={locations.map(({ name }) => name)}
        value={location}
        onChange={setLocation}
      />
      <Separator />
      <Text style={styles.sectionLabel}>{t('climbing.recent_climbs')}</Text>
      {climbs.map((climb) => (
        <ClimbCard key={climb.id} climb={climb} onLog={handleLog} />
      ))}
      <TouchableOpacity style={styles.customButton} activeOpacity={0.7}>
        <Text style={styles.customButtonText}>
          + {t('climbing.log_custom_climb')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  customButton: {
    marginTop: 8,
    backgroundColor: '#2962ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickLogTab;
