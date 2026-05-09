import { Hold, HoldType, SplinePoint } from '@shared/models/climb/climb';
import { FunctionComponent, useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { accent, palette, semantic, surfaces } from '../../../../../library/theme';
import { catmullRomToSvgPath } from './catmull-rom';
import { EditMode } from './climb-image';

const HOLD_BORDER = 2;

const HOLD_COLORS: Record<HoldType, string> = {
  normal: palette.blue,
  start: accent.primary,
  end: semantic.destructive,
  'feet-only': semantic.warning,
};

function getHoldFill(type: HoldType, editable: boolean): string {
  const base = HOLD_COLORS[type];
  const opacity = editable ? 0.7 : 0.5;
  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const SELECTED_STROKE_WIDTH = 3;
const SELECTED_RADIUS_BOOST = 2; // extra px for selected hold

const SPLINE_STROKE = 3;
const SPLINE_CONTROL_RADIUS = 5;
const SPLINE_CONTROL_BORDER = 1;
const SPLINE_SELECTED_RADIUS = 8;

interface ClimbImageOverlayProps {
  holds: Hold[];
  spline: SplinePoint[];
  editable?: boolean;
  editMode?: EditMode;
  selectedIndex: number | null;
  selectedType: 'hold' | 'spline' | null;
}

const ClimbImageOverlay: FunctionComponent<ClimbImageOverlayProps> = ({
  holds,
  spline,
  editable = false,
  editMode = 'holds',
  selectedIndex,
  selectedType,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  const hasContent = holds.length > 0 || spline.length > 0;

  if (!hasContent) {
    return <View style={styles.container} onLayout={handleLayout} />;
  }

  const { width, height } = size;
  const ready = width > 0 && height > 0;

  const toPixel = (p: { x: number; y: number }) => ({
    x: p.x * width,
    y: p.y * height,
  });

  // Pre-compute spline path
  const splinePixels = ready ? spline.map(toPixel) : [];
  const splinePath = ready ? catmullRomToSvgPath(splinePixels) : '';

  return (
    <View style={styles.container} onLayout={handleLayout} pointerEvents="none">
      {ready && (
        <Svg viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
          {/* Spline curve */}
          {splinePath !== '' && (
            <Path
              d={splinePath}
              stroke={accent.primary}
              strokeWidth={SPLINE_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Spline control points (edit mode) */}
          {editable &&
            (editMode === 'spline' || editMode === 'knife') &&
            splinePixels.map((p, i) => {
              const isSelected =
                selectedType === 'spline' && selectedIndex === i;
              return (
                <Circle
                  key={`sp-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={
                    isSelected ? SPLINE_SELECTED_RADIUS : SPLINE_CONTROL_RADIUS
                  }
                  fill={accent.primary}
                  stroke={isSelected ? accent.primary : surfaces.base}
                  strokeWidth={
                    isSelected ? SELECTED_STROKE_WIDTH : SPLINE_CONTROL_BORDER
                  }
                />
              );
            })}

          {/* Hold circles */}
          {holds.map((hold, i) => {
            const p = toPixel(hold);
            const holdRadius = hold.radius * width;
            const isSelected = selectedType === 'hold' && selectedIndex === i;
            return (
              <Circle
                key={`hold-${i}`}
                cx={p.x}
                cy={p.y}
                r={isSelected ? holdRadius + SELECTED_RADIUS_BOOST : holdRadius}
                fill={getHoldFill(hold.type, editable)}
                stroke={isSelected ? accent.primary : surfaces.base}
                strokeWidth={isSelected ? SELECTED_STROKE_WIDTH : HOLD_BORDER}
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ClimbImageOverlay;
export type { ClimbImageOverlayProps };
