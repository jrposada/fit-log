import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
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

import Separator from '../../library/separator';
import ClimbCard, { ClimbCardProps } from './climb-card';
import LocationSelector from './location-selector';

const QuickLogTab: FunctionComponent = () => {
  const { t } = useTranslation();

  const [locationId, setLocationId] = useState<string>('');

  const { data: climbHistories = [], isLoading: isLoadingClimbHistories } =
    useClimbHistories({
      limit: 3,
      locationId,
    });

  const climbHistoriesPut = useClimbHistoriesPut();

  const handleLog: ClimbCardProps['onLog'] = (climb) => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location: climb.location,
      sector: climb.sector.id,
      status: 'send',
      attempts: 1,
    });
  };
  if (isLoadingClimbHistories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2962ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LocationSelector value={locationId} onChange={setLocationId} />
      <Separator />
      <Text style={styles.sectionLabel}>{t('climbing.recent_climbs')}</Text>
      {climbHistories.map((climbHistory) => (
        <ClimbCard
          key={climbHistory.id}
          climb={{
            ...climbHistory.climb,
            sector: climbHistory.sector,
          }}
          onLog={handleLog}
          logDisabled={climbHistoriesPut.isPending}
        />
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
