import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  ImageLoadEventData,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  View,
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

type ImageBounds = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

/** Compute where `resizeMode: 'contain'` renders an image inside a container. */
function getImageBounds(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number
): ImageBounds {
  const imageAR = imageW / imageH;
  const containerAR = containerW / containerH;

  if (imageAR > containerAR) {
    // Image is wider than container — horizontal fill, vertical letterboxing
    const h = containerW / imageAR;
    return {
      offsetX: 0,
      offsetY: (containerH - h) / 2,
      width: containerW,
      height: h,
    };
  } else {
    // Image is taller — vertical fill, horizontal pillarboxing
    const w = containerH * imageAR;
    return {
      offsetX: (containerW - w) / 2,
      offsetY: 0,
      width: w,
      height: containerH,
    };
  }
}

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

  // Container size — ref for tap handler (no re-render), state for imageBounds memo
  const containerSizeRef = useRef({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Image natural dimensions — ref for tap handler, state for imageBounds memo
  const naturalSizeRef = useRef<{ width: number; height: number } | null>(null);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imageBounds = useMemo(() => {
    if (!naturalSize || containerSize.width === 0 || containerSize.height === 0)
      return null;
    return getImageBounds(
      containerSize.width,
      containerSize.height,
      naturalSize.width,
      naturalSize.height
    );
  }, [naturalSize, containerSize]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerSizeRef.current = { width, height };
    setContainerSize({ width, height });
  }, []);

  const handleImageLoad = useCallback(
    (event: NativeSyntheticEvent<ImageLoadEventData>) => {
      const { width, height } = event.nativeEvent.source;
      naturalSizeRef.current = { width, height };
      setNaturalSize({ width, height });
    },
    []
  );

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
      const { width, height } = containerSizeRef.current;
      const ns = naturalSizeRef.current;
      if (width === 0 || height === 0 || !ns) return;

      // The animated view has transform: [translateX, translateY, scale].
      // With CSS/RN transform-origin at center, the forward mapping is:
      //   screenX = s * (vx - cx) + cx + tx
      // Inverting:
      //   vx = (screenX - cx - tx) / s + cx
      const cx = width / 2;
      const cy = height / 2;
      const containerX = (tapX - cx - currentTranslateX) / currentScale + cx;
      const containerY = (tapY - cy - currentTranslateY) / currentScale + cy;

      // Normalize to image-relative 0-1 coords (accounting for contain-mode
      // letterboxing/pillarboxing) so holds are device-independent.
      const bounds = getImageBounds(width, height, ns.width, ns.height);
      const nx = (containerX - bounds.offsetX) / bounds.width;
      const ny = (containerY - bounds.offsetY) / bounds.height;

      // Ignore taps outside the actual image area
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;

      onTap({ x: nx, y: ny });
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
          <Image
            source={source}
            style={[styles.image, imageStyle]}
            onLoad={handleImageLoad}
          />
          {imageBounds && (
            <View
              style={[
                styles.imageBoundsOverlay,
                {
                  top: imageBounds.offsetY,
                  left: imageBounds.offsetX,
                  width: imageBounds.width,
                  height: imageBounds.height,
                },
              ]}
            >
              {children}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default InteractiveImage;
export type { InteractiveImageProps };
