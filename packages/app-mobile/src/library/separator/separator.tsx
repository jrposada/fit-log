import { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

export interface SeparatorProps {
  insetHorizontal?: number;
  marginVertical?: number;
  color?: string;
}

const Separator: FunctionComponent<SeparatorProps> = ({
  insetHorizontal = 0,
  marginVertical = 12,
  color = '#ddd',
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

const styles = StyleSheet.create({
  base: {
    height: 1,
    alignSelf: 'stretch',
  },
});

export default Separator;
