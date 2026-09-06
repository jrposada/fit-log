import { FunctionComponent } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import Stack from '../../../library/stack';
import { ActiveTrainingSession } from './active-training-session';
import ActiveTrainingSessionDetails from './active-training-session-details';
import ActiveTrainingSessionHeader from './active-training-session-header';
import { useActiveTrainingSessionTimer } from './use-active-training-session-timer';
import { useCurrentClimbAttempts } from './use-current-climb-attempts';
import { useStopTrainingSession } from './use-stop-training-session';

interface ActiveTrainingSessionContentProps {
  session: ActiveTrainingSession;
  isExpanded: boolean;
  onCollapse: () => void;
  onOpenDashboard: () => void;
  onOpenLogATry: () => void;
}

const ActiveTrainingSessionContent: FunctionComponent<
  ActiveTrainingSessionContentProps
> = ({ session, isExpanded, onCollapse, onOpenDashboard, onOpenLogATry }) => {
  const duration = useActiveTrainingSessionTimer(session.startedAt);
  const { handleStop, isPending } = useStopTrainingSession(session, onCollapse);
  const {
    climb: currentClimb,
    attempts,
    canStep,
    handleChangeAttempts,
    isPending: isUpdatingAttempts,
  } = useCurrentClimbAttempts(session);

  return (
    <Stack gap="md">
      <ActiveTrainingSessionHeader
        duration={duration}
        isExpanded={isExpanded}
        onOpenLogATry={onOpenLogATry}
      />

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <ActiveTrainingSessionDetails
            climbsCount={session.climbHistories.length}
            currentClimb={canStep ? currentClimb : undefined}
            attempts={attempts}
            onChangeAttempts={canStep ? handleChangeAttempts : undefined}
            isUpdatingAttempts={isUpdatingAttempts}
            isStopping={isPending}
            onStop={handleStop}
            onOpenDashboard={onOpenDashboard}
          />
        </Animated.View>
      )}
    </Stack>
  );
};

export default ActiveTrainingSessionContent;
