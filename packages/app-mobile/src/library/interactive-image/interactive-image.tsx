import { FunctionComponent, ReactNode, useCallback, useRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { styles } from './interactive-image.styles';

interface InteractiveImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  children?: ReactNode;
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  onTap?: (point: { x: number; y: number }) => void;
  onScaleChange?: (scale: number) => void;
}

const InteractiveImage: FunctionComponent<InteractiveImageProps> = ({
  source,
  style,
  imageStyle,
  children,
  minScale = 1,
  maxScale = 4,
  doubleTapScale = 2,
  onTap,
  onScaleChange,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const wasMultiTouch = useSharedValue(false);
  const containerSize = useRef({ width: 0, height: 0 });

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerSize.current = { width, height };
  }, []);

  const resetTransform = () => {
    'worklet';
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      wasMultiTouch.value = true;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, minScale), maxScale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < minScale) {
        resetTransform();
        if (onScaleChange) scheduleOnRN(onScaleChange, 1);
      } else {
        if (onScaleChange) scheduleOnRN(onScaleChange, scale.value);
      }
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      wasMultiTouch.value = true;
    })
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const handleTap = useCallback(
    (
      tapX: number,
      tapY: number,
      currentScale: number,
      currentTranslateX: number,
      currentTranslateY: number
    ) => {
      if (!onTap) return;
      const { width, height } = containerSize.current;
      if (width === 0 || height === 0) return;

      // The animated view has transform: [translateX, translateY, scale]
      // Scale applies around the view center (RN default transform-origin).
      // A point (vx, vy) in the original view maps to screen coords:
      //   screenX = cx + (vx + tx - cx) * s
      // Inverting:
      //   vx = (screenX - cx) / s + cx - tx
      const cx = width / 2;
      const cy = height / 2;
      const imageX = (tapX - cx) / currentScale + cx - currentTranslateX;
      const imageY = (tapY - cy) / currentScale + cy - currentTranslateY;

      onTap({ x: imageX / width, y: imageY / height });
    },
    [onTap]
  );

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onBegin(() => {
      wasMultiTouch.value = false;
    })
    .onEnd((event) => {
      if (onTap && !wasMultiTouch.value) {
        scheduleOnRN(
          handleTap,
          event.x,
          event.y,
          scale.value,
          translateX.value,
          translateY.value
        );
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetTransform();
        if (onScaleChange) scheduleOnRN(onScaleChange, 1);
      } else {
        scale.value = withSpring(doubleTapScale);
        savedScale.value = doubleTapScale;
        if (onScaleChange) scheduleOnRN(onScaleChange, doubleTapScale);
      }
    });

  // Double tap wins over single tap; taps run alongside pinch/pan
  const tapGestures = onTap
    ? Gesture.Exclusive(doubleTapGesture, singleTapGesture)
    : doubleTapGesture;

  const composedGesture = Gesture.Simultaneous(
    tapGestures,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container, style]} onLayout={handleLayout}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <Image source={source} style={[styles.image, imageStyle]} />
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default InteractiveImage;
export type { InteractiveImageProps };
