import { SessionSummary } from '@jrposada/fit-log-shared/models/feed/feed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types/routes';

/**
 * Per-sport dispatch for a History/Home feed row tap. FeedRow itself stays
 * sport-agnostic; each sport package's detail screen is registered here as
 * it's added.
 */
function navigateToSessionDetail(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  session: SessionSummary
): void {
  switch (session.sport) {
    case 'climbing':
      navigation.navigate('TrainingSessionsDetail', {
        trainingSessionId: session.id,
      });
      break;
  }
}

export { navigateToSessionDetail };
