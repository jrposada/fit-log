import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

import LoadingState from '../../../library/loading-state';
import Separator from '../../../library/separator';
import { useSwipeHint } from '../hooks/use-swipe-hint';
import ClimbCard, { ClimbCardProps } from './climb-card';
import LocationSelector from './location-selector';
import { styles } from './quick-log-tab.styles';

const QuickLogTab: FunctionComponent = () => {
  const { t } = useTranslation();

  const [locationId, setLocationId] = useState<string>('');

  const { data: climbHistories = [], isLoading: isLoadingClimbHistories } =
    useClimbHistories({
      limit: 3,
      locationId,
      status: ['attempt', 'project'],
    });

  const { shouldPeek, markShown } = useSwipeHint();

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
    return <LoadingState />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LocationSelector value={locationId} onChange={setLocationId} />
      <Separator />
      <Text style={styles.sectionLabel}>{t('climbing.recent_climbs')}</Text>
      {climbHistories.map((climbHistory, index) => (
        <ClimbCard
          key={climbHistory.id}
          climb={{
            ...climbHistory.climb,
            sector: climbHistory.sector,
          }}
          onLog={handleLog}
          logDisabled={climbHistoriesPut.isPending}
          shouldPeek={index === 0 && shouldPeek}
          onPeekDone={markShown}
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

export default QuickLogTab;
