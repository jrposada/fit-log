import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

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
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default UnsavedBanner;
