import { FunctionComponent, ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { styles } from './screen-header.styles';

export interface ScreenHeaderProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ScreenHeader: FunctionComponent<ScreenHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.base, style]}>
      <View style={[styles.action, styles.actionLeft]}>{leftAction}</View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.action, styles.actionRight]}>{rightAction}</View>
    </View>
  );
};

export default ScreenHeader;
