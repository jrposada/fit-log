import { FunctionComponent } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import {
  shapeStyles,
  sizeStyles,
  SwatchShape,
  SwatchSize,
} from './swatch.styles';

export interface SwatchProps {
  /** Fill color — typically a chart series color or a palette token. */
  color: string;
  size?: SwatchSize;
  shape?: SwatchShape;
  style?: StyleProp<ViewStyle>;
}

/** A small solid color indicator — e.g. the key next to a chart legend label. */
const Swatch: FunctionComponent<SwatchProps> = ({
  color,
  size = 'md',
  shape = 'square',
  style,
}) => (
  <View
    style={[
      sizeStyles[size],
      shapeStyles[shape],
      { backgroundColor: color },
      style,
    ]}
  />
);

export default Swatch;
