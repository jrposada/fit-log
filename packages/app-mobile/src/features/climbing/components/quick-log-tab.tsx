import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { FunctionComponent } from 'react';

import LoadingState from '../../../library/loading-state';
import Section from '../../../library/section';
import Separator from '../../../library/separator';
import { useSwipeHint } from '../hooks/use-swipe-hint';
import ClimbCard from './climb-card';
import LocationSelector from './location-selector';

interface QuickLogTabProps {
  locationId: string;
  onLocationChange: (locationId: string) => void;
}

const QuickLogTab: FunctionComponent<QuickLogTabProps> = ({
  locationId,
  onLocationChange,
}) => {
  const { data: climbHistories = [], isLoading: isLoadingClimbHistories } =
    useClimbHistories({
      limit: 3,
      locationId,
      status: ['attempt', 'project'],
    });

  const { shouldPeek, markShown } = useSwipeHint();

  return (
    <LoadingState isLoading={isLoadingClimbHistories}>
      <Section>
        <LocationSelector value={locationId} onChange={onLocationChange} />

        <Separator />

        {climbHistories.map((climbHistory, index) => (
          <ClimbCard
            key={climbHistory.id}
            climb={{
              ...climbHistory.climb,
              sector: climbHistory.sector,
            }}
            shouldPeek={index === 0 && shouldPeek}
            onPeekDone={markShown}
          />
        ))}
      </Section>
    </LoadingState>
  );
};

export default QuickLogTab;
