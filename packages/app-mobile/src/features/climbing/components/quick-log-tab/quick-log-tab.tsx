import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { FunctionComponent } from 'react';

import LoadingState from '../../../../library/loading-state';
import Section from '../../../../library/section';
import Separator from '../../../../library/separator';
import { useSwipeHint } from '../../hooks/use-swipe-hint';
import ClimbCard from '../common/climb-card';
import LocationSelector from '../common/location-selector';

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

        {climbHistories.map((climbHistory, index) => {
          const totalAttempts = climbHistory.tries.reduce(
            (sum, t) => sum + (t.attempts ?? 0),
            0
          );
          const lastTry = climbHistory.tries[climbHistory.tries.length - 1];

          return (
            <ClimbCard
              key={climbHistory.id}
              climb={{
                ...climbHistory.climb,
                location: {
                  id: climbHistory.location.id,
                  name: climbHistory.location.name,
                },
                sector: {
                  id: climbHistory.sector.id,
                  name: climbHistory.sector.name,
                },
                userStatus: {
                  status: climbHistory.status,
                  attempts: totalAttempts || undefined,
                  lastTriedDate: lastTry?.date,
                },
              }}
              shouldPeek={index === 0 && shouldPeek}
              onPeekDone={markShown}
            />
          );
        })}
      </Section>
    </LoadingState>
  );
};

export default QuickLogTab;
