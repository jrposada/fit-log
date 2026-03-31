import { FunctionComponent, PropsWithChildren } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

import { accent } from '../theme';
import { styles } from './loading-state.styles';

export interface LoadingStateProps {
  isLoading: boolean;
  color?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

const LoadingState: FunctionComponent<PropsWithChildren<LoadingStateProps>> = ({
  isLoading,
  children,
  color = accent.primary,
  size = 'large',
  style,
}) => {
  if (!isLoading) {
    return children ?? null;
  }

  return (
    <View style={[styles.base, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingState;
