import { FunctionComponent } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { styles } from './empty-state.styles';

export interface EmptyStateProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}

const EmptyState: FunctionComponent<EmptyStateProps> = ({ message, style }) => {
  return (
    <View style={[styles.base, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default EmptyState;
