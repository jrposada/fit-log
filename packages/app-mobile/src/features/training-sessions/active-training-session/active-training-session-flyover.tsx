import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { beautifyDate } from '@jrposada/fit-log-shared-react/beautifiers/date';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../../library/button';
import Card from '../../../library/card';
import { accent, spacing } from '../../../library/theme';
import ActiveTrainingSessionContent from './active-training-session-content';
import { styles } from './active-training-session-flyover.styles';

const ActiveTrainingSessionFlyover: FunctionComponent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: activeSession } = useTrainingSessionsActive();
  const { mutate: startTrainingSession } = useTrainingSessionsPut();
  const [isExpanded, setExpanded] = useState(false);

  const handleStartTrainingSession = () => {
    const now = new Date();

    startTrainingSession({
      title: beautifyDate(now, 'YYYY MM DD'),
      startedAt: now.toUTCString(),

      location: null,
      climbHistories: [],
    });
  };

  const containerStyle = [
    styles.container,
    { bottom: insets.bottom + spacing['3xl'] },
  ];

  return (
    <Animated.View style={containerStyle} layout={LinearTransition}>
      <Card
        variant="elevatedStrong"
        highlight={accent.primary}
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
              icon="+"
              variant="primary"
              onPress={handleStartTrainingSession}
            />
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
};

export default ActiveTrainingSessionFlyover;
