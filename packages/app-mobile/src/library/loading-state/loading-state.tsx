import { FunctionComponent } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

import { colors } from '../theme';
import { styles } from './loading-state.styles';

export interface LoadingStateProps {
  color?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

const LoadingState: FunctionComponent<LoadingStateProps> = ({
  color = colors.actionPrimary,
  size = 'large',
  style,
}) => {
  return (
    <View style={[styles.base, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingState;
