import { FunctionComponent } from 'react';
import { View } from 'react-native';

import { colors } from '../theme';
import { styles } from './separator.styles';

export interface SeparatorProps {
  insetHorizontal?: number;
  marginVertical?: number;
  color?: string;
}

const Separator: FunctionComponent<SeparatorProps> = ({
  insetHorizontal = 0,
  marginVertical = 12,
  color = colors.borderLight,
}) => {
  return (
    <View
      style={[
        styles.base,
        {
          marginVertical,
          marginHorizontal: insetHorizontal,
          backgroundColor: color,
        },
      ]}
    />
  );
};

export default Separator;
