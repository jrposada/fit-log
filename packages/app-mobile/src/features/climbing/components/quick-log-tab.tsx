import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingState from '../../../library/loading-state';
import Section from '../../../library/section';
import Separator from '../../../library/separator';
import { useSwipeHint } from '../hooks/use-swipe-hint';
import ClimbCard, { ClimbCardProps } from './climb-card';
import LocationSelector from './location-selector';

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

  return (
    <LoadingState isLoading={isLoadingClimbHistories}>
      <Section title={t('climbing.recent_climbs')}>
        <LocationSelector value={locationId} onChange={setLocationId} />

        <Separator />

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
      </Section>
    </LoadingState>
  );
};

export default QuickLogTab;
