import { FunctionComponent, useEffect, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, View } from 'react-native';

import { accent } from '../theme';

export interface RefetchBarProps {
  active: boolean;
  height?: number;
}

const BAR_WIDTH_RATIO = 0.3;
const SWEEP_DURATION_MS = 1200;

const RefetchBar: FunctionComponent<RefetchBarProps> = ({
  active,
  height = 2,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!active || containerWidth === 0) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SWEEP_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [active, containerWidth, progress]);

  const barWidth = containerWidth * BAR_WIDTH_RATIO;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth, containerWidth],
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={handleLayout} style={{ height, overflow: 'hidden' }}>
      {active && containerWidth > 0 && (
        <Animated.View
          style={{
            height,
            width: barWidth,
            backgroundColor: accent.primary,
            transform: [{ translateX }],
          }}
        />
      )}
    </View>
  );
};

export default RefetchBar;
