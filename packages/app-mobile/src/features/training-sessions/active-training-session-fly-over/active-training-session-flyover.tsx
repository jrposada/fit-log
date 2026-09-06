import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { beautifyDate } from '@jrposada/fit-log-shared-react/beautifiers/date';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import Button from '../../../library/button';
import Card from '../../../library/card';
import { accent } from '../../../library/theme';
import TrainingSessionDetail from '../training-session-detail/training-session-detail';
import { styles } from './active-training-session-flyover.styles';

interface ActiveTrainingSessionFlyoverProps {
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  onGoToDashboard: () => void;
}

const ActiveTrainingSessionFlyover: FunctionComponent<
  ActiveTrainingSessionFlyoverProps
> = ({ style, onLayout, onGoToDashboard }) => {
  const { t } = useTranslation();
  const { data: activeSession } = useTrainingSessionsActive();
  const [isExpanded, setExpanded] = useState(false);

  const {
    mutate: startTrainingSession,
    isPending: isPendingStartTrainingSession,
  } = useTrainingSessionsPut();

  const handleStartTrainingSession = (locationId: string | null = null) => {
    const now = new Date();

    startTrainingSession({
      sport: 'climbing',
      title: beautifyDate(now, 'YYYY MM DD'),
      startedAt: now.toUTCString(),
      location: locationId,
      climbHistories: [],
    });
  };

  const handleToggleExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  return (
    <Animated.View style={style} onLayout={onLayout} layout={LinearTransition}>
      <Card
        variant="elevatedStrong"
        highlight={accent.primary}
        style={styles.card}
        noPadding={!activeSession}
      >
        {activeSession ? (
          <Animated.View
            key="active"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <TrainingSessionDetail
              session={activeSession}
              isActive
              isExpanded={isExpanded}
              onToggleIsExpanded={handleToggleExpand}
              onGoToDashboard={onGoToDashboard}
            />
          </Animated.View>
        ) : (
          <Animated.View
            key="idle"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <Button
              title={t('nav.start_session')}
              icon="play-arrow"
              variant="primary"
              style={styles.startButton}
              onPress={() => handleStartTrainingSession()}
              disabled={isPendingStartTrainingSession}
            />
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
};

export default ActiveTrainingSessionFlyover;
