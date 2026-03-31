import { FunctionComponent } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { styles } from './unsaved-banner.styles';

export interface UnsavedBannerProps {
  isDirty: boolean;
  message: string;
}

const UnsavedBanner: FunctionComponent<UnsavedBannerProps> = ({
  isDirty,
  message,
}) => {
  if (!isDirty) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default UnsavedBanner;
