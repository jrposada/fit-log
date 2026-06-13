import { FunctionComponent, ReactNode, useState } from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';

export interface MeasureProps {
  /**
   * Rendered once the available width is known. Use this to size children that
   * need an explicit pixel width (e.g. charts) to the real container width,
   * rather than guessing from screen dimensions and parent padding.
   */
  children: (width: number) => ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Measures its own laid-out width and hands it to a render-prop child. Children
 * are withheld until the width is known so width-driven content never renders
 * at a wrong (overflowing) size on the first frame.
 */
const Measure: FunctionComponent<MeasureProps> = ({ children, style }) => {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setWidth((prev) => (prev === next ? prev : next));
  };

  return (
    <View style={style} onLayout={handleLayout}>
      {width > 0 ? children(width) : null}
    </View>
  );
};

export default Measure;
