import { FunctionComponent } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import Stack from '../../../library/stack';
import { ActiveTrainingSession } from './active-training-session';
import ActiveTrainingSessionDetails from './active-training-session-details';
import ActiveTrainingSessionHeader from './active-training-session-header';
import { useActiveTrainingSessionTimer } from './use-active-training-session-timer';
import { useStopTrainingSession } from './use-stop-training-session';

interface ActiveTrainingSessionContentProps {
  session: ActiveTrainingSession;
  isExpanded: boolean;
  onCollapse: () => void;
}

const ActiveTrainingSessionContent: FunctionComponent<
  ActiveTrainingSessionContentProps
> = ({ session, isExpanded, onCollapse }) => {
  const duration = useActiveTrainingSessionTimer(session.startedAt);
  const { handleStop, isPending } = useStopTrainingSession(session, onCollapse);

  return (
    <Stack gap="md">
      <ActiveTrainingSessionHeader
        duration={duration}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <ActiveTrainingSessionDetails
            climbsCount={session.climbHistories.length}
            isStopping={isPending}
            onStop={handleStop}
          />
        </Animated.View>
      )}
    </Stack>
  );
};

export default ActiveTrainingSessionContent;
