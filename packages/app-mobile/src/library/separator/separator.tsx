import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

import { borders } from '../theme';
import { styles } from './separator.styles';

export interface SeparatorProps {
  insetHorizontal?: number;
  marginVertical?: number;
  color?: string;
  label?: string;
}

const Separator: FunctionComponent<SeparatorProps> = ({
  insetHorizontal = 0,
  marginVertical = 12,
  color = borders.default,
  label,
}) => {
  if (label) {
    return (
      <View
        style={[
          styles.labeled,
          { marginVertical, marginHorizontal: insetHorizontal },
        ]}
      >
        <View style={[styles.line, { backgroundColor: color }]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

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
