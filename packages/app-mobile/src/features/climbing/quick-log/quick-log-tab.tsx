import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Separator from '../../../library/separator/separator';
import LocationSelector from './location-selector';
import RouteCard, { Route } from './route-card';

const sampleRoutes: Route[] = [
  {
    id: 'r1',
    grade: 'V4',
    name: 'Crimp City',
    section: 'Cave section',
    color: '#2e7d32',
  },
  {
    id: 'r2',
    grade: 'V5',
    name: 'The Gaston',
    section: 'Corner wall',
    color: '#f9a825',
  },
  {
    id: 'r3',
    grade: 'V6',
    name: 'Roof Monster',
    section: 'Ceiling',
    color: '#c62828',
  },
];

const locations = [
  'Mesa Rim - Pacific Beach',
  'Mesa Rim - Mission Valley',
  'The Wall - Downtown',
];

const QuickLogTab: FunctionComponent = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(locations[0]);

  const handleLog = (id: string) => {
    console.log('log route', id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LocationSelector
        locations={locations}
        value={location}
        onChange={setLocation}
      />
      <Separator />
      <Text style={styles.sectionLabel}>
        {t('climbing.recent_routes_here')}
      </Text>
      {sampleRoutes.map((route) => (
        <RouteCard key={route.id} route={route} onLog={handleLog} />
      ))}
      <TouchableOpacity style={styles.customButton} activeOpacity={0.7}>
        <Text style={styles.customButtonText}>
          + {t('climbing.log_custom_route')}
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
