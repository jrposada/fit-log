import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import Button from '../../../library/button';
import Card from '../../../library/card';
import { accent } from '../../../library/theme';
import ActiveTrainingSessionContent from './active-training-session-content';
import { styles } from './active-training-session-flyover.styles';
import { useStartTrainingSession } from './use-start-training-session';

const ActiveTrainingSessionFlyover: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: activeSession } = useTrainingSessionsActive();
  const { handleStart } = useStartTrainingSession();
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <Card
        variant="elevatedStrong"
        highlight={accent.primary}
        style={styles.card}
        onPress={
          activeSession ? () => setExpanded((expanded) => !expanded) : undefined
        }
      >
        {activeSession ? (
          <Animated.View
            key="active"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <ActiveTrainingSessionContent
              session={activeSession}
              isExpanded={isExpanded}
              onCollapse={() => setExpanded(false)}
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
              onPress={() => handleStart()}
            />
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
};

export default ActiveTrainingSessionFlyover;
