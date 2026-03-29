import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './screen-container.styles';

export interface ScreenContainerProps {
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

const ScreenContainer: FunctionComponent<
  PropsWithChildren<ScreenContainerProps>
> = ({ padding, style, children }) => {
  return (
    <View style={[styles.base, padding !== undefined && { padding }, style]}>
      {children}
    </View>
  );
};

export default ScreenContainer;
